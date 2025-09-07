const mongoose = require("mongoose");

const productDetailSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productDescription: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  category: { type: String, required: true },
  images: [{ type: String }],

  // 🔗 Brand ke sath relation
  brand: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },

  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("ProductDetail", productDetailSchema);
