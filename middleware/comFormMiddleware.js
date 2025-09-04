const multer = require("multer");
const path = require("path");

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // images uploads folder me save hongi
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});

// Filter (sirf image allow)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};

module.exports = multer({ storage, fileFilter });
