const fs = require("fs");
const path = require("path");
const multer = require("multer");

const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const UPLOAD_DIR = path.join(__dirname, "../../uploads/profile-pictures");

// Make sure the folder exists before multer tries to write into it.
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    // One file per user at a time — the old one gets deleted separately in
    // profile.service.js. Naming it by user id + timestamp keeps filenames
    // unique even if someone re-uploads seconds apart.
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${req.user._id}-${Date.now()}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  if (!ACCEPTED_TYPES.includes(file.mimetype)) {
    return cb(new Error("Please upload a JPG, PNG, or WEBP image."));
  }
  cb(null, true);
}

const uploadProfilePicture = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
});

module.exports = { uploadProfilePicture, UPLOAD_DIR };