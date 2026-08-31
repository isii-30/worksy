const express = require("express");
const controller = require("./auth.controller");

const router = express.Router();

router.post("/login", controller.postLogin);
router.post("/logout", controller.postLogout);
router.get("/me", controller.getMe);
router.post("/register", controller.postRegister);
router.post("/change-password", controller.postChangePassword);
router.post("/reset-password", controller.postResetPassword);

module.exports = router;