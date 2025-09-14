const ProductDetail = require("../../models/companySide/productDetailModel");

// Convert relative path -> absolute URL
const toAbsoluteUrl = (req, filePath) => {
  if (!filePath) return null;
  return `${req.protocol}://${req.get("host")}/${filePath.replace(/\\/g, "/")}`;
};

// ✅ Create Product Detail
exports.createProductDetail = async (req, res) => {
  try {
    const { productName, productDescription, price, stock, discount, category, brandId } = req.body;

    if (!brandId) {
      return res.status(400).json({ error: "❌ brandId is required" });
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
      user: req.user.id,
    });

    await newProduct.save();

    res.status(201).json({ message: "✅ Product detail created", product: newProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get products of a specific brand
exports.getProductDetails = async (req, res) => {
  try {
    const { brandId } = req.params;

    const products = await ProductDetail.find({brand: brandId }).lean();

    const shaped = products.map(p => ({
      ...p,
      images: p.images.map(img => toAbsoluteUrl(req, img)),
    }));

    res.json({ count: shaped.length, products: shaped });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update Product by ID
exports.updateProductDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const { productName, productDescription, price, stock, discount, category } = req.body;

    // Agar new images upload hui hain to unhe update karo
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
      { _id: id, user: req.user.id }, // sirf apne product update karega
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

// ✅ Delete Product by ID
exports.deleteProductDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await ProductDetail.findOneAndDelete({ _id: id, user: req.user.id });

    if (!deleted) {
      return res.status(404).json({ error: "❌ Product not found or not authorized" });
    }

    res.json({ message: "🗑️ Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};