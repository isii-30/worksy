const WorkspaceMember = require("./member.model");
const WorkspaceInvitation = require("./invitation.model");
const mongoose = require("mongoose");
// TEMPORARY: Senali's User model isn't merged yet. Swap this whole block for
// `const User = require("../auth/user.model");` after her model is on develop
// and pulled into this branch.
const User =
  mongoose.models.User ||
  mongoose.model(
    "User",
    new mongoose.Schema(
      { fullName: String, email: String, passwordHash: String, avatarUrl: String },
      { timestamps: true }
    )
  );

// NOTE: for now we work within a single workspace. Replace this with the
// real workspace id once workspace selection is wired in. Your old mock
// code used the string "w1"; here it must be a real Workspace ObjectId.
// Until Senuja's workspaces exist, you can hardcode a seeded workspace id.
const DEFAULT_WORKSPACE_ID = process.env.DEFAULT_WORKSPACE_ID || null;

// Get all workspace members (populated with the user's basic details)
const getMembers = async () => {
  const members = await WorkspaceMember.find()
    .populate("user", "fullName email avatarUrl") // pull these fields from User
    .lean();
  return members;
};

// Send an invitation to a registered Worksy user
const createInvitation = async (email, invitedBy) => {
  // Find the registered user by email (from Senali's users collection)
  const user = await User.findOne({
    email: new RegExp(`^${email}$`, "i"), // case-insensitive exact match
  });

  // User does not have a Worksy account
  if (!user) {
    return {
      error: "USER_NOT_FOUND",
      message: "No registered Worksy user found with this email.",
    };
  }

  // Check whether the user is already a workspace member
  const existingMember = await WorkspaceMember.findOne({ user: user._id });
  if (existingMember) {
    return {
      error: "ALREADY_MEMBER",
      message: "This user is already a workspace member.",
    };
  }

  // Check whether the user already has a pending invitation
  const existingInvitation = await WorkspaceInvitation.findOne({
    invitedUser: user._id,
    status: "pending",
  });
  if (existingInvitation) {
    return {
      error: "INVITATION_EXISTS",
      message: "This user already has a pending invitation.",
    };
  }

  // Create the invitation
  const invitation = await WorkspaceInvitation.create({
    workspace: DEFAULT_WORKSPACE_ID,
    invitedUser: user._id,
    invitedBy: invitedBy || null,
    role: "member",
    status: "pending",
  });

  return { invitation };
};

// Get invitations for a specific email
const getInvitationsByEmail = async (email) => {
  // First find the user with that email, then their invitations
  const user = await User.findOne({
    email: new RegExp(`^${email}$`, "i"),
  });

  if (!user) {
    return [];
  }

  const invitations = await WorkspaceInvitation.find({
    invitedUser: user._id,
  }).lean();

  return invitations;
};

// Accept or decline an invitation
const respondToInvitation = async (invitationId, action) => {
  // Find the invitation
  const invitation = await WorkspaceInvitation.findById(invitationId);

  if (!invitation) {
    return {
      error: "INVITATION_NOT_FOUND",
      message: "Invitation not found.",
    };
  }

  // Make sure the invitation is still pending
  if (invitation.status !== "pending") {
    return {
      error: "INVITATION_ALREADY_RESPONDED",
      message: "This invitation has already been responded to.",
    };
  }

  // Accept invitation
  if (action === "accept") {
    const user = await User.findById(invitation.invitedUser);

    if (!user) {
      return {
        error: "USER_NOT_FOUND",
        message: "Registered user not found.",
      };
    }

    // Add the user to workspace members
    const newMember = await WorkspaceMember.create({
      workspace: invitation.workspace,
      user: user._id,
      role: invitation.role || "member",
      joinedAt: new Date(),
    });

    // Update invitation status
    invitation.status = "accepted";
    invitation.respondedAt = new Date();
    await invitation.save();

    return { invitation, member: newMember };
  }

  // Decline invitation
  if (action === "decline") {
    invitation.status = "declined";
    invitation.respondedAt = new Date();
    await invitation.save();

    return { invitation };
  }

  // Invalid action
  return {
    error: "INVALID_ACTION",
    message: "Action must be either 'accept' or 'decline'.",
  };
};

module.exports = {
  getMembers,
  createInvitation,
  getInvitationsByEmail,
  respondToInvitation,
};