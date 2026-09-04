const express = require("express");
const membershipController = require("./membership.controller");

const router = express.Router();

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