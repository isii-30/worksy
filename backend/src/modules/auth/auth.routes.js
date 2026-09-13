const express = require("express");
const controller = require("./auth.controller");
const { requireAuth } = require("../../middleware/auth");

const router = express.Router();

// Open — people aren't logged in yet when they hit these.
router.post("/login", controller.postLogin);
router.post("/logout", controller.postLogout);
router.post("/register", controller.postRegister);
router.post("/reset-password", controller.postResetPassword);

// Protected — need a valid token.
router.get("/me", requireAuth, controller.getMe);
router.post("/change-password", requireAuth, controller.postChangePassword);

module.exports = router;