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

async function postLogin(req, res) {
  try {
    const { email, password } = req.body;
    const user = await authService.login(email, password);

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong. Try again." });
  }
}

async function postLogout(req, res) {
  await authService.logout();
  res.status(200).json({ success: true, message: "Logged out." });
}

async function getMe(req, res) {
  try {
    const user = await authService.getCurrentUser();
    if (!user) {
      return res.status(401).json({ success: false, message: "Not logged in." });
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong. Try again." });
  }
}

async function postRegister(req, res) {
  const { firstName, lastName, email, password } = req.body;

  const validationError = validateRegistration({ firstName, lastName, email, password });
  if (validationError) {
    return res.status(400).json({ success: false, message: validationError });
  }

  try {
    const result = await authService.register({ firstName, lastName, email, password });

    if (result.error) {
      return res.status(409).json({ success: false, message: result.error });
    }

    res.status(201).json({ success: true, data: result.data });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong. Try again." });
  }
}

async function postChangePassword(req, res) {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: "Both current and new password are required." });
  }

  const strengthOk =
    newPassword.length >= 8 &&
    /[a-z]/.test(newPassword) &&
    /[A-Z]/.test(newPassword) &&
    /\d/.test(newPassword) &&
    /[^A-Za-z0-9]/.test(newPassword);

  if (!strengthOk) {
    return res.status(400).json({
      success: false,
      message: "New password must be 8+ characters with upper, lower, number, and special character.",
    });
  }

  try {
    const result = await authService.changePassword(currentPassword, newPassword);
    if (result.error) {
      return res.status(result.status || 400).json({ success: false, message: result.error });
    }
    res.status(200).json({ success: true, data: { message: "Password updated." } });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong. Try again." });
  }
}

async function postResetPassword(req, res) {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ success: false, message: "Email and new password are required." });
  }

  const strengthOk =
    newPassword.length >= 8 &&
    /[a-z]/.test(newPassword) &&
    /[A-Z]/.test(newPassword) &&
    /\d/.test(newPassword) &&
    /[^A-Za-z0-9]/.test(newPassword);

  if (!strengthOk) {
    return res.status(400).json({
      success: false,
      message: "New password must be 8+ characters with upper, lower, number, and special character.",
    });
  }

  try {
    const result = await authService.resetPassword(email, newPassword);
    if (result.error) {
      return res.status(result.status || 400).json({ success: false, message: result.error });
    }
    res.status(200).json({ success: true, data: { message: "Password reset successfully." } });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong. Try again." });
  }
}

module.exports = { postLogin, postLogout, getMe, postRegister, postChangePassword, postResetPassword };