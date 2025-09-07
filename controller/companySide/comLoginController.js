const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Company = require("../../models/companySide/comLoginModel");

const JWT_SECRET = "secret123"; // ⚠️ .env me rakhna recommended

// Company Login
exports.comLogin = async (req, res) => {
  try {
    const { email, password } = req.body; // name ki zaroorat login ke liye nahi

    // Step 1: Email check
    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Step 2: Password check
    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Step 3: JWT token
    const token = jwt.sign(
      { id: company._id, role: "company" }, // role future me authorization ke liye
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Step 4: Response
    res.json({
      message: "✅ Company login successful",
      token,
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
