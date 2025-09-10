// controllers/userSide/productController.js
const ProductDetail = require("../../models/companySide/productDetailModel");
const Profile = require("../../models/companySide/comFormModel");

// Helper: convert relative path -> absolute URL
const toAbsoluteUrl = (req, filePath) => {
  if (!filePath) return null;
  return `${req.protocol}://${req.get("host")}/${filePath.replace(/\\/g, "/")}`;
};

// ✅ Get ALL products (with company name + image)
exports.getAllProducts = async (req, res) => {
  try {
    // saare products nikal lo
    const products = await ProductDetail.find()
      .populate("brand", "brandName") // brand name bhi show hoga
      .populate("user", "_id")        // user id chahiye to fetch company profile
      .lean();

    // har product ke liye us company ka profile nikalna
    const shaped = await Promise.all(
      products.map(async (p) => {
        const companyProfile = await Profile.findOne({ user: p.user }).lean();

        return {
          ...p,
          images: p.images.map((img) => toAbsoluteUrl(req, img)),
          company: companyProfile
            ? {
                name: companyProfile.name,
                image: toAbsoluteUrl(req, companyProfile.image),
              }
            : null,
        };
      })
    );

    res.json({
      count: shaped.length,
      products: shaped,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
