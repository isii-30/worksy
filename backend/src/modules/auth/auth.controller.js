const authService = require("./auth.service");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_REGEX = /^[A-Za-z\s'-]+$/;

function validateRegistration({ firstName, lastName, email, password }) {
  if (!firstName || !lastName || !email || !password) {
    return "All fields are required.";
  }
  if (firstName.trim().length < 2 || !NAME_REGEX.test(firstName.trim())) {
    return "First name must be at least 2 letters, with no numbers or symbols.";
  }
  if (lastName.trim().length < 2 || !NAME_REGEX.test(lastName.trim())) {
    return "Last name must be at least 2 letters, with no numbers or symbols.";
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return "Enter a valid email address.";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must include at least one lowercase letter.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must include at least one uppercase letter.";
  }
  if (!/\d/.test(password)) {
    return "Password must include at least one number.";
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Password must include at least one special character.";
  }
  return null; // no errors
}

function postLogin(req, res) {
  const { email, password } = req.body;
  const user = authService.login(email, password);

  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid email or password." });
  }

  res.status(200).json({ success: true, data: user });
}

function postLogout(req, res) {
  authService.logout();
  res.status(200).json({ success: true, message: "Logged out." });
}

function getMe(req, res) {
  const user = authService.getCurrentUser();
  if (!user) {
    return res.status(401).json({ success: false, message: "Not logged in." });
  }
  res.status(200).json({ success: true, data: user });
}

function postRegister(req, res) {
  const { firstName, lastName, email, password } = req.body;

  const validationError = validateRegistration({ firstName, lastName, email, password });
  if (validationError) {
    return res.status(400).json({ success: false, message: validationError });
  }

  const result = authService.register({ firstName, lastName, email, password });

  if (result.error) {
    return res.status(409).json({ success: false, message: result.error });
  }

  res.status(201).json({ success: true, data: result.data });
}

module.exports = { postLogin, postLogout, getMe, postRegister };