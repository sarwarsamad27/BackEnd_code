const Favourite = require("../../models/userSide/favouriteModel");
const ProductDetail = require("../../models/companySide/productDetailModel");
const Profile = require("../../models/companySide/comFormModel");

// helper: absolute path bana do
const toAbsoluteUrl = (req, filePath) => {
  if (!filePath) return null;
  return `${req.protocol}://${req.get("host")}/${filePath.replace(/\\/g, "/")}`;
};

// ✅ Add to Favourite
exports.addFavourite = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ error: "❌ productId is required" });
    }

    const fav = new Favourite({ user: req.user.id, product: productId });
    await fav.save();

    res.status(201).json({ message: "✅ Product added to favourites" });
  } catch (err) {
    if (err.code === 11000) {
      // duplicate key error (already favourited)
      return res.status(400).json({ error: "❌ Already in favourites" });
    }
    res.status(500).json({ error: err.message });
  }
};

// ✅ Remove from Favourite
exports.removeFavourite = async (req, res) => {
  try {
    const { productId } = req.params;
    await Favourite.findOneAndDelete({ user: req.user.id, product: productId });
    res.json({ message: "🗑️ Removed from favourites" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get User's Favourites (with product + company info)
exports.getFavourites = async (req, res) => {
  try {
    const favourites = await Favourite.find({ user: req.user.id })
      .populate("product")
      .lean();

    const shaped = await Promise.all(
      favourites.map(async (f) => {
        const product = f.product;
        const companyProfile = await Profile.findOne({ user: product.user }).lean();

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
