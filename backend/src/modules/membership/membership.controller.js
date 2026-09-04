const membershipService = require("./membership.service");

// Get all workspace members
const getMembers = async (req, res) => {
  try {
    const members = await membershipService.getMembers();

    res.status(200).json({
      success: true,
      data: members,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch members.",
    });
  }
};

// Send an invitation
const createInvitation = async (req, res) => {
  try {
    const { email } = req.body;

    // Check that email was provided
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    // invitedBy: the logged-in user's id.
    // TODO: replace with the real authenticated user id once auth is wired.
    const invitedBy = req.user ? req.user._id : null;

    const result = await membershipService.createInvitation(email, invitedBy);

    // User does not exist
    if (result.error === "USER_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: result.message,
      });
    }

    // User is already a member
    if (result.error === "ALREADY_MEMBER") {
      return res.status(409).json({
        success: false,
        message: result.message,
      });
    }

    // Invitation already exists
    if (result.error === "INVITATION_EXISTS") {
      return res.status(409).json({
        success: false,
        message: result.message,
      });
    }

    // Invitation successfully created
    res.status(201).json({
      success: true,
      message: "Invitation sent successfully.",
      data: result.invitation,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create invitation.",
    });
  }
};

// Get invitations for a user
const getInvitations = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const invitations = await membershipService.getInvitationsByEmail(email);

    res.status(200).json({
      success: true,
      data: invitations,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch invitations.",
    });
  }
};

// Accept or decline an invitation
const respondToInvitation = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    if (!action) {
      return res.status(400).json({
        success: false,
        message: "Action is required.",
      });
    }

    const result = await membershipService.respondToInvitation(id, action);

    if (result.error === "INVITATION_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: result.message,
      });
    }

    if (result.error === "INVITATION_ALREADY_RESPONDED") {
      return res.status(409).json({
        success: false,
        message: result.message,
      });
    }

    if (result.error === "USER_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: result.message,
      });
    }

    if (result.error === "INVALID_ACTION") {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    // Invitation accepted
    if (action === "accept") {
      return res.status(200).json({
        success: true,
        message: "Invitation accepted successfully.",
        data: {
          invitation: result.invitation,
          member: result.member,
        },
      });
    }

    // Invitation declined
    res.status(200).json({
      success: true,
      message: "Invitation declined.",
      data: result.invitation,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to respond to invitation.",
    });
  }
};

module.exports = {
  getMembers,
  createInvitation,
  getInvitations,
  respondToInvitation,
};