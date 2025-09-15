const router = require("express").Router();
// const authMiddleware = require("../middleware/authMiddleWare");
const { createComProfile, getComProfile, getAllComProfiles } = require("../controller/companySide/comFormController");
const { createProductDetail, getProductDetails , deleteProductDetail , updateProductDetail } = require("../controller/companySide/productDetailController");
const  {createProduct , getProducts ,deleteProduct , updateProduct}   = require("../controller/companySide/productEntryController"); 
const {comRegister} = require("../controller/companySide/comRegisterController");
const {comLogin} = require("../controller/companySide/comLoginController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const getCompanyOrders = require("../controller/companySide/comOrderController").getCompanyOrders;
const markDelivered = require("../controller/companySide/comOrderController").markDelivered;
const getCompanyDashboard = require("../controller/companySide/dashboardController").getCompanyDashboard;


// ✅ Product detail routes(Company side)
router.post("/comregister", comRegister);//ComRegister
router.post("/comlogin", comLogin);//ComLogin
router.post("/productentry/productdetail",upload.array("images", 5), createProductDetail);// create product detail
router.get("/productentry/productdetail",  getProductDetails);// get all product details of logged in user
router.put("/productentry/productdetail/:id",  upload.array("images", 5), updateProductDetail);// update product detail
router.delete("/productentry/productdetail/:id/:userId",  deleteProductDetail);// delete product detail
router.get("/orders/:companyId",  getCompanyOrders);// ✅ get company orders
router.put("/order/:id/deliver/:companyId",  markDelivered);// ✅ mark delivered
router.get("/productentry",  getProducts);//get all products
router.post("/productentry",  upload.single("image"), createProduct);//product create
router.put("/product/:id",  upload.single("image"), updateProduct); //  edit
router.delete("/product/:id",  deleteProduct); //  delete
router.post("/comprofile",  upload.single("image"), createComProfile);//profile create or update
router.get("/comprofile",  getComProfile);//get own profile
router.get("/comprofile/all",  getAllComProfiles);//get all profiles
router.get("/company/dashboard",  getCompanyDashboard);// get company dashboard data


module.exports = router;