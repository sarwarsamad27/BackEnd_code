const Order = require("../../models/userSide/orderModel");

// ✅ Get company orders
exports.getCompanyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ company: req.user.id }).populate("products.product");
    res.json({ count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Mark Delivered
exports.markDelivered = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOneAndUpdate(
      { _id: id, company: req.user.id },
      { status: "Delivered" },
      { new: true }
    );
    res.json({ message: "✅ Order delivered", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
