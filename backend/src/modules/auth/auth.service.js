const bcrypt = require("bcryptjs");
const User = require("./user.model");

const SALT_ROUNDS = 10;

// Same simple single-session approach you had with mockUsers — just backed
// by the database now instead of an array.
let currentUserId = null;

function toSafeUser(userDoc) {
  const obj = userDoc.toObject();
  delete obj.passwordHash;
  return obj;
}

async function login(email, password) {
  const user = await User.findOne({ email });
  if (!user) return null;

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return null;

  currentUserId = user._id;
  return toSafeUser(user);
}

async function logout() {
  currentUserId = null;
  return true;
}

async function getCurrentUser() {
  if (!currentUserId) return null;
  const user = await User.findById(currentUserId);
  if (!user) return null;
  return toSafeUser(user);
}

async function register({ firstName, lastName, email, password }) {
  const existing = await User.findOne({ email });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    passwordHash,
  });

  currentUserId = newUser._id; // registering logs you straight in, same as before

  return { data: toSafeUser(newUser) };
}

async function changePassword(currentPassword, newPassword) {
  if (!currentUserId) return { error: "Not logged in.", status: 401 };

  const user = await User.findById(currentUserId);
  if (!user) return { error: "Not logged in.", status: 401 };

  const match = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!match) {
    return { error: "Current password is incorrect.", status: 401 };
  }

  user.passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await user.save();
  return { success: true };
}

async function resetPassword(email, newPassword) {
  const user = await User.findOne({ email });
  if (!user) {
    return { error: "No account found with that email address.", status: 404 };
  }

  user.passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await user.save();
  return { success: true };
}

module.exports = { login, logout, getCurrentUser, register, changePassword, resetPassword };
