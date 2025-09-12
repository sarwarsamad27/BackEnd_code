const express = require("express");
const connectDB = require("./configure/db");
const path = require("path");
require("dotenv").config();


const app = express();

const PORT = process.env.PORT || 5000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB();

const userRoutes = require("./routes/userRoutes");
const companyRoutes = require("./routes/companyRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Mount
app.use("/api/auth", userRoutes);
app.use("/api/auth", companyRoutes);
app.use("/api/auth", adminRoutes),


app.listen(PORT, "0.0.0.0", () => {
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded ✅" : "Missing ❌");
  console.log(`🚀 Server running on port ${PORT}`);
});
