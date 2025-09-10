const Order = require("../../models/userSide/orderModel");

// ✅ Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user").populate("products.product");
    res.json({ count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Verify Order (Admin)
exports.verifyOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndUpdate(id, { status: "Verified" }, { new: true });
    res.json({ message: "✅ Order verified", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Mark as Received (after customer confirmation)
exports.markReceived = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndUpdate(id, { status: "Received" }, { new: true });
    res.json({ message: "✅ Order marked as received", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
