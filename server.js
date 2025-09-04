const express = require("express");
const connectDB = require("./configure/db");
const authRoutes = require("./routes/authRoute");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB();

app.use("/api/auth", authRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
