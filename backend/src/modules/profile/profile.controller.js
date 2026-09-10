const profileService = require("./profile.service");

async function getProfile(req, res) {
  try {
    const profile = await profileService.getProfile(req.user._id);
    if (!profile) return res.status(401).json({ success: false, message: "Not logged in." });
    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong. Try again." });
  }
}

async function putProfile(req, res) {
  try {
    const updated = await profileService.updateProfile(req.user._id, req.body);
    if (!updated) return res.status(401).json({ success: false, message: "Not logged in." });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong. Try again." });
  }
}

async function uploadProfilePicture(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file was provided." });
    }
    const imageUrl = `/uploads/profile-pictures/${req.file.filename}`;
    const updated = await profileService.updateProfilePicture(req.user._id, imageUrl);
    if (!updated) return res.status(401).json({ success: false, message: "Not logged in." });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong. Try again." });
  }
}

async function removeProfilePicture(req, res) {
  try {
    const updated = await profileService.removeProfilePicture(req.user._id);
    if (!updated) return res.status(401).json({ success: false, message: "Not logged in." });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong. Try again." });
  }
}

module.exports = { getProfile, putProfile, uploadProfilePicture, removeProfilePicture };