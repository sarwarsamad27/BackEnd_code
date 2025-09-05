// models/product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String }, // file ka path
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ add this

  },
);

module.exports = mongoose.model("Product", productSchema);
