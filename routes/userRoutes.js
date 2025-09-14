const { getAllProducts } = require("../controller/userSide/AllproductController");
const favouriteController = require("../controller/userSide/favouriteController");
const orderController = require("../controller/userSide/orderController");
const { createUserProfile, getUserProfile, getAllUserProfiles } = require("../controller/userSide/userFormController");
const multer = require("multer");
const {useRegister} = require("../controller/userSide/userRegisterController");
const {userLogin} = require("../controller/userSide/userLoginConroller");
const authMiddleware = require("../middleware/authMiddleWare");

const upload = multer({ dest: "uploads/" });
const express = require("express");
const router = express.Router();


// Public routes(User Side)
router.post("/userregister", useRegister);//UserRegister
router.post("/userlogin", userLogin);//UserLogin
router.post("/userprofile", authMiddleware, upload.single("image"), createUserProfile);//profile create or update
router.get("/userprofile", authMiddleware, getUserProfile);//get own profile
router.get("/userprofile/all", authMiddleware, getAllUserProfiles);//get all profiles
router.get("/allproducts", getAllProducts);//get all products with company name and image
router.post("/favourites", authMiddleware, favouriteController.addFavourite);// add to favourites
router.delete("/favourites/:productId", authMiddleware, favouriteController.removeFavourite);// remove from favourites
router.get("/favourites", authMiddleware, favouriteController.getFavourites);// get user's favourites
// Order Routes
router.post("/orders", authMiddleware, orderController.createOrder);// create order
router.get("/orders", authMiddleware, orderController.getMyOrders);// get user's orders




module.exports = router;