// const express = require("express");
// const  {createProduct , getProducts ,deleteProduct , updateProduct}   = require("../controller/companySide/productEntryController"); 
// const {comRegister} = require("../controller/companySide/comRegisterController");
// const {comLogin} = require("../controller/companySide/comLoginController");
// const {useRegister} = require("../controller/userSide/userRegisterController");
// const {userLogin} = require("../controller/userSide/userLoginConroller");
// const authMiddleware = require("../middleware/authMiddleWare");
// const multer = require("multer");
// const { createComProfile, getComProfile, getAllComProfiles } = require("../controller/companySide/comFormController");
// const { createUserProfile, getUserProfile, getAllUserProfiles } = require("../controller/userSide/userFormController");
// const { createProductDetail, getProductDetails , deleteProductDetail , updateProductDetail } = require("../controller/companySide/productDetailController");
// const { getAllProducts } = require("../controller/userSide/AllproductController");
// const favouriteController = require("../controller/userSide/favouriteController");
// const orderController = require("../controller/userSide/orderController");


// const upload = multer({ dest: "uploads/" });
// const router = express.Router();

// // Public routes(Company Side)
// router.post("/comregister", comRegister);//ComRegister
// router.post("/comlogin", comLogin);//ComLogin

// // Public routes(User Side)
// router.post("/userregister", useRegister);//UserRegister
// router.post("/userlogin", userLogin);//UserLogin

// // Protected Company routes(Company Side)
// router.post("/comprofile", authMiddleware, upload.single("image"), createComProfile);//profile create or update
// router.get("/comprofile", authMiddleware, getComProfile);//get own profile
// router.get("/comprofile/all", authMiddleware, getAllComProfiles);//get all profiles

// // Protected routes(User Side)
// router.post("/userprofile", authMiddleware, upload.single("image"), createUserProfile);//profile create or update
// router.get("/userprofile", authMiddleware, getUserProfile);//get own profile
// router.get("/userprofile/all", authMiddleware, getAllUserProfiles);//get all profiles

// // Product routes(Company side)
// router.get("/productentry", authMiddleware, getProducts);//get all products
// router.post("/productentry", authMiddleware, upload.single("image"), createProduct);//product create
// router.put("/product/:id", authMiddleware, upload.single("image"), updateProduct); //  edit
// router.delete("/product/:id", authMiddleware, deleteProduct); //  delete


// // ✅ Product detail routes(Company side)
// router.post("/productentry/productdetail",authMiddleware,upload.array("images", 5), createProductDetail);// create product detail
// router.get("/productentry/productdetail/:brandId", authMiddleware, getProductDetails);// get all product details of logged in user
// router.put("/productentry/productdetail/:id", authMiddleware, upload.array("images", 5), updateProductDetail);// update product detail
// router.delete("/productentry/productdetail/:id", authMiddleware, deleteProductDetail);// delete product detail
// router.get("/orders", authMiddleware, getCompanyOrders);// ✅ get company orders
// router.put("/order/:id/deliver", authMiddleware, markDelivered);// ✅ mark delivered


// //userSide
// // ✅ Get ALL products (with company name + image)
// router.get("/allproducts", getAllProducts);//get all products with company name and image
// router.post("/favourites", authMiddleware, favouriteController.addFavourite);// add to favourites
// router.delete("/favourites/:productId", authMiddleware, favouriteController.removeFavourite);// remove from favourites
// router.get("/favourites", authMiddleware, favouriteController.getFavourites);// get user's favourites
// // Order Routes
// router.post("/orders", authMiddleware, orderController.createOrder);
// router.get("/orders", authMiddleware, orderController.getMyOrders);




// //Admin Side
// // ✅ get all orders
// router.get("/orders", authMiddleware, getAllOrders);

// // ✅ verify order
// router.put("/order/:id/verify", authMiddleware, verifyOrder);

// // ✅ mark received
// router.put("/order/:id/received", authMiddleware, markReceived);

// module.exports = router;
