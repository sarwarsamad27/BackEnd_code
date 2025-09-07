// controller/comFormController.js
const path = require("path");
const Profile = require("../../models/userSide/userFormModel");

/**
 * 🧩 helper: image ka absolute URL bana do
 * DB me hum relative path save karte hain (e.g., uploads/169...jpg)
 * Frontend ko full URL chahiye (http://host/uploads/169...jpg)
 */
const toAbsoluteImageUrl = (req, imagePath) => {
  if (!imagePath) return null;
  // ensure forward slashes in URL
  const clean = imagePath.replace(/\\/g, "/");
  return `${req.protocol}://${req.get("host")}/${clean}`;
};

/**
 * POST /api/auth/profile
 * 🔐 Protected: token required (authMiddleware)
 * 📥 Body: form-data (image file + name/email/mobile/address/description)
 * ✅ Creates/overwrites the logged-in user's profile
 */
exports.createUserProfile = async (req, res) => {
  try {
    const { name, email, mobile, address, description } = req.body;
    const image = req.file ? req.file.path : null;

    // Agar user ka profile already exist hai to update, warna create
    const update = {
      name,
      email,
      mobile,
      address,
      description,
      ...(image && { image }),
      user: req.user.id || req.user, // depends on your middleware shape
    };

    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id || req.user },
      update,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // response me absolute image URL bhejo
    const result = {
      ...profile.toObject(),
      image: toAbsoluteImageUrl(req, profile.image),
    };

    res.status(201).json({ message: "✅ Profile saved", profile: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/auth/profile/com
 * 🔐 Protected: token required
 * 🧾 Returns the complete profile of the logged-in user (ComProfile)
 */
exports.getUserProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id || req.user });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // absolute URL convert
    const result = {
      ...profile.toObject(),
      image: toAbsoluteImageUrl(req, profile.image),
    };

    res.json({ message: "✅ ComProfile fetched", profile: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * (optional) GET /api/auth/profile/all
 * 🔐 Protected (admin-only ideally): sare profiles list
 * Useful agar list dikhani ho.
 */
exports.getAllUserProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().lean();
    const shaped = profiles.map((p) => ({
      ...p,
      image: toAbsoluteImageUrl(req, p.image),
    }));
    res.json({ count: shaped.length, profiles: shaped });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
