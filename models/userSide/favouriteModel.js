const mongoose = require("mongoose");

const favouriteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductDetail",
      required: true,
    },
  },
  { timestamps: true }
);

// ek user ek hi product ko bar bar favourite na kar sake
favouriteSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model("Favourite", favouriteSchema);
