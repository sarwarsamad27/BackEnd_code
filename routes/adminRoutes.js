const authMiddleware = require("../middleware/authMiddleWare");
const { getAllOrders, verifyOrder, markReceived } = require("../controller/adminSide/orderController");

const router = require("express").Router();



// ✅ get all orders
router.get("/orders", authMiddleware, getAllOrders);

// ✅ verify order
router.put("/order/:id/verify", authMiddleware, verifyOrder);

// ✅ mark received
router.put("/order/:id/received", authMiddleware, markReceived);



module.exports = router;