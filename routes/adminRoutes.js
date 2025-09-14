const { getAllOrders, verifyOrder, markReceived } = require("../controller/adminSide/orderController");

const router = require("express").Router();



// ✅ get all orders
router.get("/orders", getAllOrders);

// ✅ verify order
router.put("/order/:id/verify", verifyOrder);

// ✅ mark received
router.put("/order/:id/received", markReceived);



module.exports = router;