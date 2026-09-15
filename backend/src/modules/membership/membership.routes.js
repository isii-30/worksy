const express = require("express");
const membershipController = require("./membership.controller");
const { requireAuth } = require("../../middleware/auth");

const router = express.Router();

// Every route below needs a valid token
router.use(requireAuth);

// Get all workspace members
router.get("/members", membershipController.getMembers);

// Send an invitation
router.post("/invitations", membershipController.createInvitation);

// Get invitations for a specific user
router.get("/invitations", membershipController.getInvitations);

// Accept or decline an invitation
router.patch(
  "/invitations/:id",
  membershipController.respondToInvitation
);

module.exports = router;