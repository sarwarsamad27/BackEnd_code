const express = require("express");
const  createProduct  = require("../controller/companySide/productEntryController"); // ✅ ab dono import
const {register} = require("../controller/companySide/registerController");
const {login} = require("../controller/companySide/loginController");
const authMiddleware = require("../middleware/authMiddleWare");
const multer = require("multer");
const { createProfile, getComProfile, getAllProfiles } = require("../controller/companySide/comFormController");

const upload = multer({ dest: "uploads/" });
const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.post("/profile", authMiddleware, upload.single("image"), createProfile);
router.get("/comprofile", authMiddleware, getComProfile);
router.get("/profiles", authMiddleware, getAllProfiles);
router.post("/productentry", authMiddleware, upload.single("image"), createProduct);

module.exports = router;
