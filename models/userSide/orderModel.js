const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    address: { type: String, required: true },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ProductDetail",
          required: true,
        },
        quantity: { type: Number, default: 1 },
      },
    ],
    status: {
      type: String,
      enum: ["For Verify", "Verified", "Delivered", "Received"],
      default: "For Verify",
    },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" }, // jis company ka product hai
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
