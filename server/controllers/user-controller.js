const User = require('../model/User.js');
const Grupa = require('../model/Grupa');
const Objava = require('../model/Objava');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signup = async(req, res, next) => {
    const { korisnickoIme, email, password} = req.body;
    let existingUser;

    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        console.log(err);
    }
    if (existingUser) {
        return res.status(400).json({message: "Korisnik već postoji! Prijavite se!"});
    }

    const hashPassword = bcrypt.hashSync(password);

    const user = new User({
        korisnickoIme,
        email,
        password: hashPassword
    });

    try {
        await user.save();
    }catch (err) {
        console.log(err);
    }

    return res.status(201).json({message: "Uspješno ste registrirani!"});
};

const login = async (req, res, next) => {
    const {email, password} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({email: email});
    } catch (err){
        return new Error(err);
    }
    if (!existingUser) {
        return res.status(400).json({message: "User not found. Sign up!"})
    }
    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({message: "Invalid email/password!"})
    }
    const token = jwt.sign({id: existingUser._id}, process.env.JWT_SECRET, {expiresIn: "35s",});

    console.log("generated token\n", token);

    if(req.cookies[`${existingUser._id}`]) {
        req.cookies[`${existingUser._id}`] = ""
    }

    res.cookie(String(existingUser._id), token, {
        path: '/',
        expires: new Date(Date.now() + 1000 * 30),
        httpOnly: true,
        sameSite: 'lax',
    });

    return res.status(200).json({message: "Successfully logged in! :)", user: existingUser, token});
};

const verifyToken = (req, res, next) => {
    const cookies = req.headers.cookie;
    const token = cookies.split("=")[1];
    if (!token) {
      res.status(404).json({ message: "No token found" });
    }
    jwt.verify(String(token), process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(400).json({ message: "Invalid Token" });
      }
      console.log(user.id);
      req.id = user.id;
    });
    next();
  };

const getUser = async (req, res, next) => {
    const userId = req.id;
    let user;
    try {
        user = await User.findById(userId, "-password");
    } catch (err){
        return new Error(err);
    }
    if (!user) {
        return res.status(404).json({message: "user not found"});
    }
    return res.status(200).json({user});
};
const getGrupa = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log("grupa id:", id)
        const grupa = await Grupa.findById(id);
        console.log(grupa.imeGrupe)
        res.status(200).json(grupa);
      } catch (err) {
        res.status(404).json({ message: err.message });
      }
}

const novaGrupa = async(req, res, next) => {
    const { imeGrupe } = req.body;
    const userId = req.id;
  
    try {
      // Provjeri postoji li grupa s istim imenom
      const existingGrupa = await Grupa.findOne({ imeGrupe: imeGrupe });
      if (existingGrupa) {
        return res.status(400).json({ message: 'Grupa već postoji!' });
      }
  
      // Kreiraj novu grupu
      const novaGrupa = new Grupa({
        imeGrupe,
        admin: userId,
      });
      // Dodaj novu grupu u bazu podataka kod korisnika-admina
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ message: 'Korisnik nije pronađen!' });
      }
      // Spremi novu grupu u bazu podataka
      await novaGrupa.save();
  
      user.grupe.push(novaGrupa);
      await user.save();
  
      // Vrati novu grupu
      res.status(201).json({ novaGrupa });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }               
  };                                
                                                                                                                                                           
const refreshToken = (req, res, next) => {
    const cookies = req.headers.cookie;
    const prevToken = cookies.split("=")[1];
    if(!prevToken) {
        return res.status(400).json({message: "Couldn't find token"});
    }
    jwt.verify(String(prevToken), process.env.JWT_SECRET, (err, user) => {
        if(err) {
            console.log(err);
            return res.status(403).json({message: "Autentication faild"})
        };

        res.clearCookie(`${user.id}`);
        req.cookies[`${user.id}`] = "";

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {
            expiresIn: "35s"
        });
        res.cookie(String(user.id), token, {
            path: '/',
            expires: new Date(Date.now() + 1000 * 30),
            httpOnly: true,
            sameSite: 'lax',
        });

        req.id = user.id;
        next();
    })
};

const logout = (req, res, next) => {
    const cookies = req.headers.cookie;
    const prevToken = cookies.split("=")[1];
    if(!prevToken) {
        return res.status(400).json({message: "Couldn't find token"});
    }
    jwt.verify(String(prevToken), process.env.JWT_SECRET, (err, user) => {
        if(err) {
            console.log(err);
            return res.status(403).json({message: "Autentication faild"})
        };

        res.clearCookie(`${user.id}`);
        req.cookies[`${user.id}`] = "";
        return res.status(200).json({message: "Successfully Logged Out"})
    })
}

exports.signup = signup;
exports.login = login;
exports.verifyToken = verifyToken;
exports.getUser = getUser;
exports.getGrupa = getGrupa;
exports.novaGrupa = novaGrupa;
exports.refreshToken = refreshToken;
exports.logout = logout;