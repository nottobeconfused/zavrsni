const express = require('express');
const { signup, login, verifyToken, getUser, refreshToken, logout, getObjave, getGrupa, novaGrupa, novaObjava } = require('../controllers/user-controller');

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/user", verifyToken, getUser);
router.post("/nova-grupa", verifyToken, novaGrupa);
router.post("/:id/nova-objava", verifyToken, novaObjava);
router.get("/objave", verifyToken, getObjave);
router.get("/grupe/:id", verifyToken, refreshToken, getGrupa);
router.get("/refresh", refreshToken, verifyToken, getUser);
router.post("/logout", verifyToken, logout);

module.exports = router;