const bcrypt = require("bcryptjs");
const User = require("../../models/userSide/userLoginModel");

// ✅ User Login (no token version)
exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 1: Check email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "❌ Invalid email or password" });
    }

    // Step 2: Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "❌ Invalid email or password" });
    }

    // ✅ Sirf user data return karo (no token)
    res.json({
      message: "✅ Login successful",
      user: {
        id: user._id,
        email: user.email,
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
