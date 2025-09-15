const bcrypt = require("bcryptjs");
const Company = require("../../models/companySide/comLoginModel");

// ✅ Company Login (without token)
exports.comLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

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

    // ✅ Sirf company data return karo (no token)
    res.json({
      message: "✅ Company login successful",
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
