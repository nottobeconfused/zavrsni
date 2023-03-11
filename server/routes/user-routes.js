const express = require('express');
const { signup, login, verifyToken, getUser, refreshToken, logout, getObjava } = require('../controllers/user-controller');

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/user", verifyToken, getUser, getObjava);
router.get("/refresh", refreshToken, verifyToken, getUser);
router.post("/logout", verifyToken, logout);

module.exports = router;