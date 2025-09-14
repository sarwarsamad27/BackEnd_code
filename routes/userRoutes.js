const { getAllProducts } = require("../controller/userSide/AllproductController");
const favouriteController = require("../controller/userSide/favouriteController");
const orderController = require("../controller/userSide/orderController");
const { createUserProfile, getUserProfile, getAllUserProfiles } = require("../controller/userSide/userFormController");
const multer = require("multer");
const {useRegister} = require("../controller/userSide/userRegisterController");
const {userLogin} = require("../controller/userSide/userLoginConroller");

const upload = multer({ dest: "uploads/" });
const express = require("express");
const router = express.Router();


// Public routes(User Side)
router.post("/userregister", useRegister);//UserRegister
router.post("/userlogin", userLogin);//UserLogin
router.post("/userprofile", upload.single("image"), createUserProfile);//profile create or update
router.get("/userprofile", getUserProfile);//get own profile
router.get("/userprofile/all", getAllUserProfiles);//get all profiles
router.get("/allproducts", getAllProducts);//get all products with company name and image
router.post("/favourites", favouriteController.addFavourite);// add to favourites
router.delete("/favourites/:productId", favouriteController.removeFavourite);// remove from favourites
router.get("/favourites", favouriteController.getFavourites);// get user's favourites
// Order Routes
router.post("/orders", orderController.createOrder);// create order
router.get("/orders", orderController.getMyOrders);// get user's orders




module.exports = router;