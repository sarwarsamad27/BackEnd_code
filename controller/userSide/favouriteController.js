const Favourite = require("../../models/userSide/favouriteModel");
const ProductDetail = require("../../models/companySide/productDetailModel");
const Profile = require("../../models/companySide/comFormModel");

// helper: absolute path bana do
const toAbsoluteUrl = (req, filePath) => {
  if (!filePath) return null;
  return `${req.protocol}://${req.get("host")}/${filePath.replace(/\\/g, "/")}`;
};

// ✅ Add to Favourite (no auth)
exports.addFavourite = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
      return res.status(400).json({ error: "❌ userId and productId are required" });
    }

    const fav = new Favourite({ user: userId, product: productId });
    await fav.save();

    res.status(201).json({ message: "✅ Product added to favourites" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "❌ Already in favourites" });
    }
    res.status(500).json({ error: err.message });
  }
};

// ✅ Remove from Favourite (no auth)
exports.removeFavourite = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    if (!userId || !productId) {
      return res.status(400).json({ error: "❌ userId and productId are required" });
    }

    await Favourite.findOneAndDelete({ user: userId, product: productId });
    res.json({ message: "🗑️ Removed from favourites" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get User's Favourites (with product + company info) — no auth
exports.getFavourites = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "❌ userId is required" });
    }

    const favourites = await Favourite.find({ user: userId })
      .populate("product")
      .lean();

    const shaped = await Promise.all(
      favourites.map(async (f) => {
        const product = f.product;
        const companyProfile = await Profile.findOne({ email: product.email }).lean();

        return {
          _id: f._id,
          product: {
            ...product,
            images: product.images.map((img) => toAbsoluteUrl(req, img)),
          },
          company: companyProfile
            ? {
                name: companyProfile.name,
                image: toAbsoluteUrl(req, companyProfile.image),
              }
            : null,
        };
      })
    );

    res.json({ count: shaped.length, favourites: shaped });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
