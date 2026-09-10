const jwt = require("jsonwebtoken");

// Reads the token from the Authorization header ("Bearer <token>"), verifies
// it, and attaches the logged-in user's id as req.user. Any route that uses
// this middleware can trust req.user._id instead of guessing who's asking.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ success: false, message: "Not logged in." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: payload.sub };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Session expired or invalid. Please log in again." });
  }
}

module.exports = { requireAuth };