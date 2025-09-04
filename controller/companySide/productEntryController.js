// controller/productController.js
const Product = require("../../models/companySide/comProductEntryModel");

const toAbsoluteImageUrl = (req, imagePath) => {
  if (!imagePath) return null;
  const clean = imagePath.replace(/\\/g, "/");
  return `${req.protocol}://${req.get("host")}/${clean}`;
};

/**
 * POST /api/product
 * 🔐 Protected
 * 📥 Body: form-data { name, image(file) }
 */
const createProduct = async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file ? req.file.path : null;

    const product = new Product({
      name,
      image,
    });

    await product.save();
    res.status(201).json({ message: "✅ Product created", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = createProduct ;