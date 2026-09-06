const profileService = require("./profile.service");

async function getProfile(req, res) {
  try {
    const profile = await profileService.getProfile();
    if (!profile) return res.status(401).json({ success: false, message: "Not logged in." });
    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong. Try again." });
  }
}

async function putProfile(req, res) {
  try {
    const updated = await profileService.updateProfile(req.body);
    if (!updated) return res.status(401).json({ success: false, message: "Not logged in." });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong. Try again." });
  }
}

module.exports = { getProfile, putProfile };