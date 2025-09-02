const jwt = require("jsonwebtoken");
const JWT_SECRET = "secret123"; // 🔑 env me rakhna best hai

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // user id inject kar diya

    next(); // next controller chalao
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
    