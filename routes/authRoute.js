const express = require("express");
const  {createProduct , getProducts ,deleteProduct , updateProduct}   = require("../controller/companySide/productEntryController"); 
const {register} = require("../controller/companySide/registerController");
const {login} = require("../controller/companySide/loginController");
const authMiddleware = require("../middleware/authMiddleWare");
const multer = require("multer");
const { createProfile, getComProfile, getAllProfiles } = require("../controller/companySide/comFormController");
const { createProductDetail, getAllProductDetails , deleteProductDetail , updateProductDetail } = require("../controller/companySide/productDetailController");


const upload = multer({ dest: "uploads/" });
const router = express.Router();

// Public routes
router.post("/register", register);//register
router.post("/login", login);//login

// Protected routes
router.post("/profile", authMiddleware, upload.single("image"), createProfile);//profile create or update
router.get("/comprofile", authMiddleware, getComProfile);//get own profile
router.get("/profiles", authMiddleware, getAllProfiles);//get all profiles

// Product routes
router.get("/productentry", authMiddleware, getProducts);//get all products
router.post("/productentry", authMiddleware, upload.single("image"), createProduct);//product create
router.put("/product/:id", authMiddleware, upload.single("image"), updateProduct); //  edit
router.delete("/product/:id", authMiddleware, deleteProduct); //  delete
// ✅ Product detail routes
router.post("/productentry/productdetail",authMiddleware,upload.array("images", 5), createProductDetail);// create product detail
router.get("/productentry/productdetail", authMiddleware, getAllProductDetails);// get all product details of logged in user
router.put("/productentry/productdetail/:id", authMiddleware, upload.array("images", 5), updateProductDetail);// update product detail
router.delete("/productentry/productdetail/:id", authMiddleware, deleteProductDetail);// delete product detail


module.exports = router;
