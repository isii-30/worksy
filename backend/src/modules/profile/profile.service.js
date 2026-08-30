const mockUsers = require("../../data/mock/users");
const authService = require("../auth/auth.service");

function getProfile() {
  const current = authService.getCurrentUser();
  return current || null;
}

function updateProfile(updates) {
  const current = authService.getCurrentUser();
  if (!current) return null;

  const user = mockUsers.find((u) => u.id === current.id);
  Object.assign(user, updates);

  const { password: _pw, ...safeUser } = user;
  return safeUser;
}

module.exports = { getProfile, updateProfile };