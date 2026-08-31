const membershipService = require("./membership.service");

// Get all workspace members
const getMembers = (req, res) => {
  const members = membershipService.getMembers();

  res.status(200).json({
    success: true,
    data: members,
  });
};

// Get all board names
const getBoardNames = (req, res) => {
  const boards = membershipService.getBoardNames();

  res.status(200).json({
    success: true,
    data: boards,
  });
};

// Send an invitation
const createInvitation = (req, res) => {
  const { email } = req.body;

  // Check that email was provided
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required.",
    });
  }

  const result = membershipService.createInvitation(email);

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
};

// Get invitations for a user
const getInvitations = (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required.",
    });
  }

  const invitations = membershipService.getInvitationsByEmail(email);

  res.status(200).json({
    success: true,
    data: invitations,
  });
};

// Accept or decline an invitation
const respondToInvitation = (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  if (!action) {
    return res.status(400).json({
      success: false,
      message: "Action is required.",
    });
  }

  const result = membershipService.respondToInvitation(id, action);

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
};

module.exports = {
  getMembers,
  getBoardNames,
  createInvitation,
  getInvitations,
  respondToInvitation,
};