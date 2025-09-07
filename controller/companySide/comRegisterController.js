const bcrypt = require("bcryptjs");
const ComUser = require("../../models/companySide/comLoginModel");

// Company Register
exports.comRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;  // ✅ name add kiya

    // Step 1: Check if email already exists
    const existingUser = await ComUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "❌ User already exists" });
    }

    // Step 2: Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 3: Create new company user
    const newUser = new ComUser({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Step 4: Success response
    res.status(201).json({ 
      message: "✅ Company registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
