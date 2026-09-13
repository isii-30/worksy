const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./user.model");

const SALT_ROUNDS = 10;

function toSafeUser(userDoc) {
  const obj = userDoc.toObject();
  delete obj.passwordHash;
  return obj;
}

// Issues a token that identifies one specific user. This replaces the old
// shared `currentUserId` variable — instead of the server remembering who's
// logged in, each request now carries its own proof of identity.
function issueToken(userId) {
  return jwt.sign({ sub: userId.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

async function login(email, password) {
  const user = await User.findOne({ email });
  if (!user) return null;

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return null;

  const token = issueToken(user._id);
  return { user: toSafeUser(user), token };
}

async function getCurrentUser(userId) {
  if (!userId) return null;
  const user = await User.findById(userId);
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

  const token = issueToken(newUser._id); // registering logs you straight in, same as before

  return { data: toSafeUser(newUser), token };
}

async function changePassword(userId, currentPassword, newPassword) {
  if (!userId) return { error: "Not logged in.", status: 401 };

  const user = await User.findById(userId);
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

module.exports = { login, getCurrentUser, register, changePassword, resetPassword, issueToken };