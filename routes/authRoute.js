const express = require("express");
const  register = require("../controller/companySide/register");
const  login = require("../controller/companySide/login");
const  profile = require("../controller/companySide/profile");

const authMiddleware = require("../middleware/authMiddleWare");
const multer = require("multer");
const {
  createProfile,
  getComProfile,
  getAllProfiles, // optional
} = require("../controller/companySide/comFormController");

const upload = multer({ dest: "uploads/" });
const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/pro", profile);


// Protected route
router.post("/profile", authMiddleware, upload.single("image"), createProfile);
router.get("/profile/com", authMiddleware, getComProfile);
router.get("/profiles", authMiddleware, getAllProfiles); // optional


module.exports = router; // ✅ CommonJS export
