const User = require('../model/User.js');
const Grupa = require('../model/Grupa');
const Objava = require('../model/Objava');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Datoteka = require('../model/Datoteka.js');
const path = require("path");
const asyncWrapper = require("../middleware/asyncWrapper.js")
const Komentar = require('../model/Komentar.js');
const Odgovor = require('../model/Odgovor.js');

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
        expires: new Date(Date.now() + 1000 * 60 * 58),
        httpOnly: true,
        sameSite: 'lax',
    });

    return res.status(200).json({message: "Successfully logged in! :)", user: existingUser, token});
};

const verifyToken = (req, res, next) => {
  const cookies = req.headers.cookie;
  const token = cookies.split("=")[1];
  if (!token) {
    return res.status(404).json({ message: "No token found" });
  }
  jwt.verify(String(token), process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(400).json({ message: "Invalid Token" });
    }
    console.log(user.id);
    req.id = user.id;
    next();
  });
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
      const korisnikIds = req.body.korisnikIds;
      const userId = req.id;
  
      // provjeri postoji li grupa s danim ID-jem i je li otvorena
      const grupa = await Grupa.findById(grupaId);
      if (!grupa) {
        return res.status(404).json({ message: "Tražena grupa nije pronađena ili nije otvorena." });
      }
  
      // provjeri je li trenutni korisnik admin grupe
      if (grupa.admin.toString() !== userId) {
        return res.status(403).json({ message: "Samo admin grupe može dodavati korisnike u grupu." });
      }
  
      // provjeri postoji li barem jedan korisnik s danim ID-jem
      const korisnici = await User.find({ _id: { $in: korisnikIds } });
      if (korisnici.length !== korisnikIds.length) {
        return res.status(404).json({ message: "Neki od korisnika nisu pronađeni." });
      }
  
      // dodaj korisnike u grupu i ažuriraj njihove grupe u njihovim tablicama
      await Grupa.findByIdAndUpdate(grupaId, { $addToSet: { users: { $each: korisnikIds } } });
      await User.updateMany({ _id: { $in: korisnikIds } }, { $addToSet: { grupe: { id: grupa._id, imeGrupe: grupa.imeGrupe } } });
  
      res.status(200).json({ message: "Korisnici su uspješno dodani u grupu." });
    } catch (err) {
      next(err);
    }
  };
  const getKorisnici = async (req, res, next) => {
    const { pretraga } = req.params;
  
    try {
      let korisnici = [];
  
      if (pretraga) {
        const keys = ["korisnickoIme", "email"];
        korisnici = await User.find({
          $or: keys.map((key) => ({ [key]: { $regex: pretraga, $options: "i" } })),
        }).limit(10);
      } else {
        korisnici = await User.find().limit(5);
      }
  
      res.json(korisnici);
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

   await  res.status(200).json(objave);
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

const getKomentariIzObjave = async (req, res, next) => {
  try {
    const objavaId = req.params.id;

    // provjera je li grupa otvorena
    const objava = await Objava.findById(objavaId);
    if (!objava) {
      return res.status(404).json({ message: "Tražena objava nije pronađena ili nije otvorena." });
    }

    const komentari = await Komentar.find({ objavaId });

    res.status(200).json(komentari);
  } catch (err) {
    next(err);
  }
};

const getOdgovoriIzObjave = async (req, res, next) => {
  try {
    const objavaId = req.params.id;

    // provjera je li grupa otvorena
    const objava = await Objava.findById(objavaId);
    if (!objava) {
      return res.status(404).json({ message: "Tražena objava nije pronađena ili nije otvorena." });
    }

    const odgovori = await Odgovor.find({ objavaId });

    res.status(200).json(odgovori);
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
    const naslov = req.body.naslov;
    const sadrzaj = req.body.sadrzaj;
    const OD = req.body.OD;
    const DO = req.body.DO;
    const ocjena = req.body.ocjena;
    const ifZadatak = req.body.ifZadatak;
    const userId = req.id;
    const file = req.file;
    const { id } = req.params;
    const grupa = await Grupa.findById(id);
    console.log(naslov, sadrzaj, userId, id)
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
        od: OD, 
        do: DO, 
        ocjena: ocjena,
        ifZadatak: ifZadatak,
      });
      if (file) {
        const item = await Datoteka.create({ file: file.path, objavaId: novaObjava._id});
        novaObjava.datoteke.push({ id: item._id });
        // Save the new Objava object to the database
      await novaObjava.save();
      // Add the new Objava object to the relevant Grupa object's objave array
      grupa.objave.push({ id: novaObjava._id });
      await grupa.save();
      } else {
        await novaObjava.save();
      // Add the new Objava object to the relevant Grupa object's objave array
      grupa.objave.push({ id: novaObjava._id });
      await grupa.save();
      }
      res.status(201).json({ novaObjava });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };
  const getDatoteka = async (req, res) => {
    const objavaId = req.params.id;
    try{
      const objava = await Objava.findById(objavaId);
      if (!objava) {
        return res.status(404).json({ message: "Tražena objava nije pronađena ili nije otvorena." });
      }
    const datoteke = await Datoteka.find({ objavaId });
         res.status(200).json(datoteke);
    }catch (error){
         console.log(error)
    }
};
const getDatotekaIzOdgovora = async (req, res) => {
  const odgovorId = req.params.id;
  try{
    const odgovor = await Odgovor.findById(odgovorId);
    if (!odgovor) {
      return res.status(404).json({ message: "Tražena objava nije pronađena ili nije otvorena." });
    }
    const datoteke = await Datoteka.find({ odgovorId });
    res.status(200).json(datoteke);
  } catch (error) {
    console.log(error);
  }
};


const downloadDatoteka = asyncWrapper(async (req, res, next) => {
    const {id} = req.params;
    const item = await Datoteka.findById(id);
    if(!item){
         return next(new Error("No item found!"));
    }
    const file = item.file;
    const filePath = path.join(__dirname, `../${file}`);
    res.download(filePath);
});        
const urediObjavu = async (req, res, next) => {
  const naslov = req.body.naslov;
  const sadrzaj = req.body.sadrzaj;
  const OD = req.body.OD;
  const DO = req.body.DO;
  const ocjena = req.body.ocjena;
  const userId = req.id;
  const { id } = req.params;

  try {
    // Find the existing Objava object
    const objava = await Objava.findById(id);
    if (!objava) {
      return res.status(400).json({ message: 'Objava nije pronađena!' });
    }
    // Check if the user is the admin of the group the Objava belongs to
    const grupa = await Grupa.findById(objava.grupaId);
    if (!grupa) {
      return res.status(400).json({ message: 'Grupa nije pronađena!' });
    }
    if (grupa.admin.toString() !== userId) {
      return res.status(401).json({ message: 'Nemate ovlasti za ažuriranje ove objave!' });
    }

    // Update the Objava object
    objava.nazivObjave = naslov;
    objava.tekst = sadrzaj;
    objava.od = OD;
    objava.do = DO;
    objava.ocjena = ocjena;

    // Check if the user uploaded a new file
    const file = req.file;
    if (file) {
      const item = await Datoteka.create({ file: file.path, objavaId: id});
      objava.datoteke.push({ id: item._id });
      // Save the new Objava object to the database
    await objava.save();
    }

    await objava.save();

    res.status(200).json({ objava });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};    
  const dodajKomentar = async (req, res, next) => {
    const { sadrzaj } = req.body;
  const objavaId = req.params.id;
  const userId = req.id;
  try {
    const objava = await Objava.findById(objavaId);
    if (!objava) {
      return res.status(404).json({ message: 'Objava nije pronađena!' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Korisnik nije pronađen!' });
    }

    const noviKomentar = new Komentar({
      user: user.korisnickoIme,
      tekst: sadrzaj,
      objavaId: objavaId,
    })
    
    await noviKomentar.save();
    objava.komentari.push({id: noviKomentar._id});
   await objava.save();
    res.status(200).json({ objava });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  }; 
  const dodajKomentarUzZadacu = async (req, res, next) => {
    const { sadrzaj } = req.body;
  const {objavaId} = req.params.id;
  const userId = req.id;
  try {
    const odgovor = await Odgovor.find(objavaId);
    if (!odgovor) {
      return res.status(404).json({ message: 'Objava nije pronađena!' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Korisnik nije pronađen!' });
    }

    const noviKomentar = new Komentar({
      user: user.korisnickoIme,
      tekst: sadrzaj,
      objavaId: objavaId,
    })
    
    await noviKomentar.save();
    odgovor.komentari.push({id: noviKomentar._id});
   await odgovor.save();
    res.status(200).json({ odgovor });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  };
  
  const dodajOdgovor = async (req, res, next) => {
    const { komentar } = req.body;
  const objavaId = req.params.id;
  const userId = req.id;
  try {
    const objava = await Objava.findById(objavaId);
    if (!objava) {
      return res.status(404).json({ message: 'Objava nije pronađena!' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Korisnik nije pronađen!' });
    }

    const noviOdgovor = new Odgovor({
      admin: user.korisnickoIme,
      komentari: komentar,
      objavaId: objavaId,
    })
    const file = req.file;
    if (file) {
      const item = await Datoteka.create({ file: file.path, objavaId: noviOdgovor._id});
      noviOdgovor.datoteke.push({ id: item._id, file: file.path });
      // Save the new Objava object to the database
    await noviOdgovor.save();
    }
    await noviOdgovor.save();
    await objava.save();
    
    objava.odgovori.push({id: noviOdgovor._id});
   await objava.save();
    res.status(200).json({ objava });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  };
    
  const obrisiObjavu = async (req, res, next) => {
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
    await objava.remove();
   
    res.status(200).json({ message: "Objava uspješno obrisana!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  }; 
  const obrisiDatoteku = async (req, res, next) => {
    const datId = req.params.id;
    try {
      const datoteka = await Datoteka.findById(datId);
      if (!datoteka) {
        return res.status(404).json({ message: 'Datoteka nije pronađena!' });
      }
      await datoteka.remove();
     
      res.status(200).json({ message: "Datoteka uspješno obrisana!" });
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
            expires: new Date(Date.now() + 1000 * 60 * 57),
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
exports.getKorisnici = getKorisnici;
exports.dodajKorisnikaUGrupu = dodajKorisnikaUGrupu;
exports.getObjave = getObjave;
exports.getObjaveIzGrupe = getObjaveIzGrupe;
exports.getKomentariIzObjave = getKomentariIzObjave;
exports.getOdgovoriIzObjave = getOdgovoriIzObjave;
exports.novaGrupa = novaGrupa;
exports.novaObjava = novaObjava;
exports.urediObjavu = urediObjavu;
exports.dodajKomentar = dodajKomentar;
exports.dodajKomentarUzZadacu =dodajKomentarUzZadacu;
exports.dodajOdgovor = dodajOdgovor;
exports.obrisiObjavu = obrisiObjavu;
exports.getDatoteka = getDatoteka;
exports.downloadDatoteka = downloadDatoteka;
exports.obrisiDatoteku =obrisiDatoteku;
exports.getDatotekaIzOdgovora = getDatotekaIzOdgovora;
exports.refreshToken = refreshToken;
exports.logout = logout;