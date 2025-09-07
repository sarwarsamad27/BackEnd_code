const mongoose = require("mongoose");

const comUserSchema = new mongoose.Schema({
  name: { type: String, required: true }, // unique hata do (multiple companies same name rakh sakti hain)
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true }); // timestamps = createdAt, updatedAt

module.exports = mongoose.model("Company", comUserSchema);
