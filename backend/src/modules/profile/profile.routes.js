const express = require("express");
const controller = require("./profile.controller");

const router = express.Router();

router.get("/", controller.getProfile);
router.put("/", controller.putProfile);

module.exports = router;