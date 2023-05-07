const express = require('express');
const upload = require('../middleware/multer.js');
const { 
     signup, 
     login, 
     verifyToken, 
     getUser, 
     refreshToken, 
     logout, 
     getObjave, 
     getGrupa, 
     novaGrupa, 
     novaObjava, 
     urediObjavu, 
     getObjaveIzGrupe, 
     dodajKorisnikaUGrupu, 
     getKorisnici, 
     obrisiObjavu, 
     dodajKomentar, 
     getKomentariIzObjave,
     downloadDatoteka,
     getDatoteka,
     obrisiDatoteku,
     novizadatak,
} = require('../controllers/user-controller');
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/user", verifyToken, getUser);
router.post("/nova-grupa", verifyToken, novaGrupa);
router.post("/objava-komentar/:id", verifyToken, dodajKomentar);
router.post("/objava-brisanje/:id", verifyToken, obrisiObjavu);
router.get("/korisnici/:pretraga", verifyToken, getKorisnici);
router.get("/korisnici", verifyToken, getKorisnici);
router.post("/dodaj-korisnika/:id", verifyToken, dodajKorisnikaUGrupu)
router.get("/objave", verifyToken, getObjave);
router.get("/grupe/:id", verifyToken, refreshToken, getGrupa);
router.get("/grupe-objave/:id", verifyToken, refreshToken, getObjaveIzGrupe);
router.get("/objava-komentari/:id", verifyToken, getKomentariIzObjave);
router.route("/:id/nova-objava").post(upload.single('file'), verifyToken, novaObjava);
router.route("/objava/:id").post(upload.single('file'), verifyToken, urediObjavu);
router.route("/objava-datoteke-download/:id").get(verifyToken, downloadDatoteka);
router.route("/objava-datoteke/:id").get(getDatoteka);
router.post("/datoteka-brisanje/:id", verifyToken, obrisiDatoteku);
router.get("/refresh", refreshToken, verifyToken, getUser);
router.post("/logout", verifyToken, logout);

module.exports = router;