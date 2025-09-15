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
const {getMyOrders , createOrder} = require("../controller/userSide/orderController");
const {addFavourite , removeFavourite , getFavourites} = require("../controller/userSide/favouriteController");


// Public routes(User Side)
router.post("/userregister", useRegister);//UserRegister
router.post("/userlogin", userLogin);//UserLogin
router.post("/userprofile",  upload.single("image"), createUserProfile);//profile create or update
router.get("/userprofile/:userId",  getUserProfile);//get own profile
router.get("/userprofile/all",  getAllUserProfiles);//get all profiles
router.get("/allproducts", getAllProducts);//get all products with company name and image
router.post("/favourites", addFavourite);// add to favourites
router.delete("/favourites/:userId/:productId",  removeFavourite);// remove from favourites
router.get("/favourites/:userId", getFavourites);// get user's favourites
// Order Routes
router.post("/orders",  createOrder);// create order
router.get("/orders",  getMyOrders);// get user's orders




module.exports = router;