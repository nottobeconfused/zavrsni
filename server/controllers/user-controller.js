const User = require('../model/User.js');
const Grupa = require('../model/Grupa');
const Objava = require('../model/Objava');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')

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
    const token = jwt.sign({id: existingUser._id}, process.env.JWT_SECRET, {expiresIn: "1h",});

    console.log("generated token\n", token);

    if(req.cookies[`${existingUser._id}`]) {
        req.cookies[`${existingUser._id}`] = ""
    }

    res.cookie(String(existingUser._id), token, {
        path: '/',
        expires: new Date(Date.now() + 1000 * 60 * 59),
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

async function getUser(req, res, next) {
    const userId = req.id;
    let user;
    try {
        user = await User.findById(userId, "-password");
    } catch (err) {
        return new Error(err);
    }
    if (!user) {
        return res.status(404).json({ message: "user not found" });
    }
    return res.status(200).json({ user });
}
const dodajKorisnikaUGrupu = async (req, res, next) => {
  try {
    const grupaId = req.params.id;
    const noviId = req.body.id;
    const userId = req.id;

    // provjeri postoji li korisnik s danim ID-jem
    const korisnik = await User.findById(noviId);
    if (!korisnik) {
      return res.status(404).json({ message: "Korisnik nije pronađen." });
    }

    // provjeri postoji li grupa s danim ID-jem i je li otvorena
    const grupa = await Grupa.findById(grupaId);
    if (!grupa) {
      return res.status(404).json({ message: "Tražena grupa nije pronađena ili nije otvorena." });
    }

    // provjeri je li trenutni korisnik admin grupe
    if (!grupa.admin.equals(userId)) {
      return res.status(403).json({ message: "Samo admin grupe može dodavati korisnike u grupu." });
    }

    // provjeri je li korisnik već dodan u grupu
    if (korisnik.grupe.includes(grupaId)) {
      return res.status(400).json({ message: "Korisnik je već dodan u traženu grupu." });
    }

    // dodaj korisnika u grupu i ažuriraj njegove grupe u njegovoj tablici
    await Grupa.findByIdAndUpdate(grupaId, { $push: { korisnici: korisnik._id } });
    await User.findByIdAndUpdate(userId, { $push: { grupe: { id: grupa._id, imeGrupe: grupa.imeGrupe } } });

    res.status(200).json({ message: "Korisnik je uspješno dodan u grupu." });
  } catch (err) {
    next(err);
  }
};

const getGrupa = async (req, res, next) => {
    try {
        const { id } = req.params;
        const grupa = await Grupa.findById(id);
        res.status(200).json(grupa);
      } catch (err) {
        res.status(404).json({ message: err.message });
      }
}
const getObjave = async (req, res, next) => {
  try {
    const userId = req.id;

    const user = await User.findById(userId, "-password").populate("grupe");
    const grupaIds = user.grupe.map(grupa => grupa.id);

    const objave = await Objava.find({ grupaId: { $in: grupaIds } });

    res.status(200).json(objave);
  } catch (err) {
    next(err);
  }
}
const getObjaveIzGrupe = async (req, res, next) => {
  try {
    const grupaId = req.params.id;

    // provjera je li grupa otvorena
    const grupa = await Grupa.findById(grupaId);
    if (!grupa) {
      return res.status(404).json({ message: "Tražena grupa nije pronađena ili nije otvorena." });
    }

    const objave = await Objava.find({ grupaId });

    res.status(200).json(objave);
  } catch (err) {
    next(err);
  }
};


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
      novaGrupa.users.push(userId);
      await novaGrupa.save();
  
      user.grupe.push({imeGrupe: novaGrupa.imeGrupe, id: novaGrupa._id});
      await user.save();

      // Vrati novu grupu
      res.status(201).json({ novaGrupa });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }               
  };    
  const novaObjava = async (req, res, next) => {
    const { naslov, sadrzaj } = req.body;
    const userId = req.id;
    const { id } = req.params;
      const grupa = await Grupa.findById(id);
      if (!grupa) {
        return res.status(400).json({ message: 'Grupa nije pronađena!' });
      }
    try {
      // Create a new Objava object
      const novaObjava = new Objava({
        nazivObjave: naslov,
        tekst: sadrzaj,
        admin: userId,
        grupa: grupa.imeGrupe, 
        grupaId: grupa.id,
      });
  
      // Save the new Objava object to the database
      await novaObjava.save();
  
      // Add the new Objava object to the relevant Grupa object's objave array
      
      grupa.objave.push({id: novaObjava._id});
      await grupa.save();
  
      res.status(201).json({ novaObjava });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };        
  const urediObjavu = async (req, res, next) => {
    const { naslov, sadrzaj} = req.body;
  const objavaId = req.params.id;
  const userId = req.id;
  try {
    const objava = await Objava.findById(objavaId);
    if (!objava) {
      return res.status(404).json({ message: 'Objava nije pronađena!' });
    }
    if (objava.admin.toString() !== userId) {
      return res.status(401).json({ message: 'Nemate ovlasti za ažuriranje objave!' });
    }
    objava.nazivObjave = naslov;
    objava.tekst = sadrzaj;
    await objava.save();
   
    res.status(200).json({ objava });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  };                
                                                                                                                                                           
const refreshToken = (req, res, next) => {
    const cookies = req.headers.cookie;
    const prevToken = cookies.split("=")[1];
    console.log(prevToken)
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
            expiresIn: "1h"
        });
        res.cookie(String(user.id), token, {
            path: '/',
            expires: new Date(Date.now() + 1000 * 60 * 59),
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
exports.getGrupa = getGrupa;
exports.getUser = getUser;
exports.dodajKorisnikaUGrupu = dodajKorisnikaUGrupu;
exports.getObjave = getObjave;
exports.getObjaveIzGrupe = getObjaveIzGrupe;
exports.novaGrupa = novaGrupa;
exports.novaObjava = novaObjava;
exports.urediObjavu = urediObjavu;
exports.refreshToken = refreshToken;
exports.logout = logout;