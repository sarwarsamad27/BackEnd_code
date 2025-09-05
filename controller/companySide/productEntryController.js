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
exports.createProduct = async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file ? req.file.path : null;

    // ⚡ Pehle check karo ke same user ke pass same naam ka product to nahi hai
    const existingProduct = await Product.findOne({ 
      name: name, 
      user: req.user.id 
    });

    if (existingProduct) {
      return res.status(400).json({ message: "❌ Product already exists" });
    }

    // ✅ Agar nahi mila to naya product create karo
    const product = new Product({
      name,
      image,
      user: req.user.id,
    });

    await product.save();
    res.status(201).json({ message: "✅ Product created", product });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



/**
 * GET /api/product
 * 🔐 Protected
 * 🧾 Get all products
 */
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id }).lean();

    const shaped = products.map((p) => ({
      ...p,
      image: p.image ? `${req.protocol}://${req.get("host")}/${p.image.replace(/\\/g, "/")}` : null,
    }));

    res.json({ count: shaped.length, products: shaped });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ✅ UPDATE
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params; // Product ka id URL se ayega
    const { name } = req.body;
    const image = req.file ? req.file.path : undefined;

    // Sirf us user ke product ko update karne ki permission
    const product = await Product.findOne({ _id: id, user: req.user.id });
    if (!product) {
      return res.status(404).json({ message: "❌ Product not found" });
    }

    if (name) product.name = name;
    if (image) product.image = image;

    await product.save();

    res.json({ message: "✅ Product updated", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOneAndDelete({ _id: id, user: req.user.id });
    if (!product) {
      return res.status(404).json({ message: "❌ Product not found" });
    }

    res.json({ message: "✅ Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};  