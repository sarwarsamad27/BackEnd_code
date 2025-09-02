const express = require("express");
const connectDB = require("./configure/db");
const authRoutes = require("./routes/authRoute");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use("/api/auth", authRoutes);

// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
