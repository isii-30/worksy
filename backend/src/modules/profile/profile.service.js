const fs = require("fs");
const path = require("path");
const authService = require("../auth/auth.service");
const User = require("../auth/user.model");
const { UPLOAD_DIR } = require("../../middleware/upload");

function toSafeUser(userDoc) {
  const obj = userDoc.toObject();
  delete obj.passwordHash;
  return obj;
}

// Best-effort delete of an old profile picture file. Never lets a missing
// or already-deleted file block the actual profile update.
function deleteStoredImage(imageUrl) {
  if (!imageUrl || !imageUrl.startsWith("/uploads/profile-pictures/")) return;
  const filename = path.basename(imageUrl);
  const filePath = path.join(UPLOAD_DIR, filename);
  fs.unlink(filePath, () => {}); // ignore errors — file may already be gone
}

async function getProfile(userId) {
  return authService.getCurrentUser(userId);
}

async function updateProfile(userId, updates) {
  const current = await authService.getCurrentUser(userId);
  if (!current) return null;

  // Profile edits should never be able to change the password or email —
  // those go through change-password / a dedicated flow instead. Picture
  // updates go through updateProfilePicture()/removeProfilePicture()
  // instead of this generic update, so strip it out here too.
  const { passwordHash, password, email, profileImage, ...safeUpdates } = updates;

  const user = await User.findByIdAndUpdate(current._id, safeUpdates, { new: true });
  return toSafeUser(user);
}

async function updateProfilePicture(userId, imageUrl) {
  const current = await User.findById(userId);
  if (!current) return null;

  deleteStoredImage(current.profileImage);

  current.profileImage = imageUrl;
  await current.save();
  return toSafeUser(current);
}

async function removeProfilePicture(userId) {
  const current = await User.findById(userId);
  if (!current) return null;

  deleteStoredImage(current.profileImage);

  current.profileImage = null;
  await current.save();
  return toSafeUser(current);
}

module.exports = { getProfile, updateProfile, updateProfilePicture, removeProfilePicture };