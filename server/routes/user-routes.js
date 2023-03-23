const express = require('express');
const { signup, login, verifyToken, getUser, refreshToken, logout, getObjava, getGrupa, novaGrupa } = require('../controllers/user-controller');

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/user", verifyToken, getUser, getObjava);
router.get("/grupe", getGrupa, novaGrupa);
router.get("/grupe/objava", getGrupa, getObjava);
router.get("/refresh", refreshToken, verifyToken, getUser);
router.post("/logout", verifyToken, logout);

module.exports = router;