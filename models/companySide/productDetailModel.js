const mongoose = require("mongoose");

const productDetailSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productDescription: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  discount: { type: Number, default: 0 }, // optional, default 0
  category: { type: String, required: true },
  images: [{ type: String }], // multiple image paths/urls
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // link with logged in user
}, { timestamps: true });

module.exports = mongoose.model("ProductDetail", productDetailSchema);
