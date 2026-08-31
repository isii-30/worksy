const profileService = require("./profile.service");

function getProfile(req, res) {
  const profile = profileService.getProfile();
  if (!profile) return res.status(401).json({ success: false, message: "Not logged in." });
  res.status(200).json({ success: true, data: profile });
}

function putProfile(req, res) {
  const updated = profileService.updateProfile(req.body);
  if (!updated) return res.status(401).json({ success: false, message: "Not logged in." });
  res.status(200).json({ success: true, data: updated });
}

module.exports = { getProfile, putProfile };