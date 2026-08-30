const mockUsers = require("../../data/mock/users");

let currentUserId = null;

function login(email, password) {
  const user = mockUsers.find((u) => u.email === email && u.password === password);
  if (!user) return null;

  currentUserId = user.id;
  const { password: _pw, ...safeUser } = user;
  return safeUser;
}

function logout() {
  currentUserId = null;
  return true;
}

function getCurrentUser() {
  const user = mockUsers.find((u) => u.id === currentUserId);
  if (!user) return null;
  const { password: _pw, ...safeUser } = user;
  return safeUser;
}

function register({ firstName, lastName, email, password }) {
  const existing = mockUsers.find((u) => u.email === email);
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const newUser = {
    id: `u${mockUsers.length + 1}`,
    firstName,
    lastName,
    email,
    password,
    dob: "",
    contactNumber: "",
    jobTitle: "",
    bio: "",
    profileImage: null,
  };

  mockUsers.push(newUser);
  currentUserId = newUser.id; // registering logs you straight in, same as most real apps

  const { password: _pw, ...safeUser } = newUser;
  return { data: safeUser };
}

module.exports = { login, logout, getCurrentUser, register };