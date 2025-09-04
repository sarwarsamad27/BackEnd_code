const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // jis user ka profile hai
    required: true,
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true }, 
  address: { type: String, required: true },
  description: { type: String },
  image: { type: String }, // yahan sirf file ka path store hoga
});

module.exports = mongoose.model("Profile", profileSchema);
