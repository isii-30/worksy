const express = require("express");
const controller = require("./profile.controller");
const { requireAuth } = require("../../middleware/auth");
const { uploadProfilePicture } = require("../../middleware/upload");

const router = express.Router();

// Wraps multer so its errors (wrong file type, too large) come back as a
// normal JSON error response instead of Express's default HTML error page.
function handlePictureUpload(req, res, next) {
  uploadProfilePicture.single("image")(req, res, (err) => {
    if (err) {
      const message =
        err.code === "LIMIT_FILE_SIZE" ? "Image must be smaller than 5MB." : err.message || "Failed to upload image.";
      return res.status(400).json({ success: false, message });
    }
    next();
  });
}

router.get("/", requireAuth, controller.getProfile);
router.put("/", requireAuth, controller.putProfile);
router.post("/picture", requireAuth, handlePictureUpload, controller.uploadProfilePicture);
router.delete("/picture", requireAuth, controller.removeProfilePicture);

module.exports = router;