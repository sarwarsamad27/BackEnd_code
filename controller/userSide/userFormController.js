const path = require("path");
const Profile = require("../../models/userSide/userFormModel");

/**
 * 🧩 helper: image ka absolute URL bana do
 */
const toAbsoluteImageUrl = (req, imagePath) => {
  if (!imagePath) return null;
  const clean = imagePath.replace(/\\/g, "/");
  return `${req.protocol}://${req.get("host")}/${clean}`;
};

/**
 * POST /api/auth/userprofile
 * 📥 Body: form-data (image file + name/email/mobile/address/description + userId)
 * ✅ Creates/overwrites the user's profile (no auth)
 */
exports.createUserProfile = async (req, res) => {
  try {
    const { userId, name, email, mobile, address, description } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "❌ userId is required" });
    }

    const image = req.file ? req.file.path : null;

    const update = {
      user: userId,
      name,
      email,
      mobile,
      address,
      description,
      ...(image && { image }),
    };

    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      update,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

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
 * GET /api/auth/userprofile/:userId
 * 🧾 Returns the profile of the given user
 */
exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "❌ userId is required" });
    }

    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const result = {
      ...profile.toObject(),
      image: toAbsoluteImageUrl(req, profile.image),
    };

    res.json({ message: "✅ UserProfile fetched", profile: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/auth/userprofile/all
 * 🧾 Returns all user profiles
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
