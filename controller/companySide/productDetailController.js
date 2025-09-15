const ProductDetail = require("../../models/companySide/productDetailModel");

// Convert relative path -> absolute URL
const toAbsoluteUrl = (req, filePath) => {
  if (!filePath) return null;
  return `${req.protocol}://${req.get("host")}/${filePath.replace(/\\/g, "/")}`;
};

// ✅ Create Product Detail (no security)
exports.createProductDetail = async (req, res) => {
  try {
    const { productName, productDescription, price, stock, discount, category, brandId, userId } = req.body;

    if (!brandId || !userId) {
      return res.status(400).json({ error: "❌ brandId and userId are required" });
    }

    const images = req.files ? req.files.map(file => file.path) : [];

    const newProduct = new ProductDetail({
      productName,
      productDescription,
      price,
      stock,
      discount,
      category,
      images,
      brand: brandId, // 👈 link to brand
      user: userId,   // 👈 ab userId body me bhejna hoga
    });

    await newProduct.save();

    res.status(201).json({ message: "✅ Product detail created", product: newProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get products of a specific brand (no token)
exports.getProductDetails = async (req, res) => {
  try {
    const { brandId, userId } = req.params;

    if (!brandId || !userId) {
      return res.status(400).json({ error: "❌ brandId and userId are required" });
    }

    const products = await ProductDetail.find({ user: userId, brand: brandId }).lean();

    const shaped = products.map(p => ({
      ...p,
      images: p.images.map(img => toAbsoluteUrl(req, img)),
    }));

    res.json({ count: shaped.length, products: shaped });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update Product by ID (no token)
exports.updateProductDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, productDescription, price, stock, discount, category, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "❌ userId is required" });
    }

    let updateData = {
      productName,
      productDescription,
      price,
      stock,
      discount,
      category,
    };

    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => file.path);
    }

    const updated = await ProductDetail.findOneAndUpdate(
      { _id: id, user: userId }, // ab userId body se aayega
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "❌ Product not found or not authorized" });
    }

    res.json({ message: "✅ Product updated", product: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete Product by ID (no token)
exports.deleteProductDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "❌ userId is required" });
    }

    const deleted = await ProductDetail.findOneAndDelete({ _id: id, user: userId });

    if (!deleted) {
      return res.status(404).json({ error: "❌ Product not found or not authorized" });
    }

    res.json({ message: "🗑️ Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
