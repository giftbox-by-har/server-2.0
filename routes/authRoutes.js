const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

// Rute untuk login
router.post("/login", authController.login);

// Rute untuk refresh token
router.post("/refresh-token", authController.refreshToken);

// Rute untuk register
router.post("/register", authController.register);

// Rute untuk access token
router.post('/verify-token', authController.verifyToken);
module.exports = router;
