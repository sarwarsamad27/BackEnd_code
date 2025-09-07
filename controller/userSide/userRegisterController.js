const bcrypt = require("bcryptjs");
const User = require("../../models/userSide/userLoginModel");


// ✅ User Register
exports.useRegister = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 1: Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "❌ User already exists" });
    }

    // Step 2: Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 3: Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "✅ User registered successfully",
      user: {
        id: newUser._id,
        email: newUser.email,
        password: newUser.password
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};