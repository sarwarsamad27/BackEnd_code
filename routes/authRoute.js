const express = require("express");
const { register, login, profile } = require("../controller/authController");
const authMiddleware = require("../middleware/authMiddleWare");

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected route
router.get("/profile", authMiddleware, profile);

module.exports = router;
