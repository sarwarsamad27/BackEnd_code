const Order = require("../../models/userSide/orderModel");

// ✅ Get company orders (no auth)
exports.getCompanyOrders = async (req, res) => {
  try {
    const { companyId } = req.params;
    if (!companyId) {
      return res.status(400).json({ error: "❌ companyId is required" });
    }

    const orders = await Order.find({ company: companyId }).populate("products.product");
    res.json({ count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Mark Delivered (no auth)
exports.markDelivered = async (req, res) => {
  try {
    const { id, companyId } = req.params;
    if (!id || !companyId) {
      return res.status(400).json({ error: "❌ orderId and companyId are required" });
    }

    const order = await Order.findOneAndUpdate(
      { _id: id, company: companyId },
      { status: "Delivered" },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "❌ Order not found for this company" });
    }

    res.json({ message: "✅ Order delivered", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
