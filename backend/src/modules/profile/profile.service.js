const authService = require("../auth/auth.service");
const User = require("../auth/user.model");

function toSafeUser(userDoc) {
  const obj = userDoc.toObject();
  delete obj.passwordHash;
  return obj;
}

async function getProfile() {
  return authService.getCurrentUser();
}

async function updateProfile(updates) {
  const current = await authService.getCurrentUser();
  if (!current) return null;

  // Profile edits should never be able to change the password or email —
  // those go through change-password / a dedicated flow instead.
  const { passwordHash, password, email, ...safeUpdates } = updates;

  const user = await User.findByIdAndUpdate(current._id, safeUpdates, { new: true });
  return toSafeUser(user);
}

module.exports = { getProfile, updateProfile };
