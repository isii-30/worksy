const express = require("express");
const notificationController = require("./notification.controller");

const router = express.Router();

router.get("/", notificationController.getNotifications);

module.exports = router;