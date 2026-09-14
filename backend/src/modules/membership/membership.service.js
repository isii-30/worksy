const WorkspaceMember = require("./member.model");
const WorkspaceInvitation = require("./invitation.model");
// Senali's real User model (auth module). Adjust the path if her file lives
// elsewhere — the model registered there is named "User".
const User = require("../auth/user.model");
// Dilmani's board member model — read only, so we can tell who is already on a board.
const BoardMember = require("../board/boardMember.model");

// NOTE: for now we work within a single workspace. Replace this with the
// real workspace id once workspace selection is wired in. Your old mock
// code used the string "w1"; here it must be a real Workspace ObjectId.
// Until Senuja's workspaces exist, you can hardcode a seeded workspace id.
const DEFAULT_WORKSPACE_ID = process.env.DEFAULT_WORKSPACE_ID || null;

// Get all workspace members (populated with the user's basic details)
const getMembers = async () => {
  const members = await WorkspaceMember.find()
    .populate("user", "firstName lastName email profileImage") // real User fields
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

// Get the logged-in user's own invitations
const getInvitationsForUser = async (userId) => {
  const invitations = await WorkspaceInvitation.find({
    invitedUser: userId,
  })
    .populate("invitedBy", "firstName lastName email")
    .lean();

  return invitations;
};

// Accept or decline an invitation
const respondToInvitation = async (invitationId, action, userId) => {
  // Find the invitation
  const invitation = await WorkspaceInvitation.findById(invitationId);

  if (!invitation) {
    return {
      error: "INVITATION_NOT_FOUND",
      message: "Invitation not found.",
    };
  }

  // Only the invited user may respond to their own invitation
  if (String(invitation.invitedUser) !== String(userId)) {
    return {
      error: "NOT_YOUR_INVITATION",
      message: "This invitation does not belong to you.",
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

// Workspace members who are NOT already on this board.
// Used by Dilmani's "add a workspace member to a board" feature.
// She passes both ids, because the board document is hers, not mine.
const getAddableMembers = async (workspaceId, boardId) => {
  // 1. everyone in this workspace
  const workspaceMembers = await WorkspaceMember.find({
    workspace: workspaceId,
  })
    .populate("user", "firstName lastName email profileImage")
    .lean();

  // 2. everyone already on this board
  const boardMembers = await BoardMember.find({ board: boardId })
    .select("user")
    .lean();

  // 3. put the board user ids in a Set for fast lookup.
  //    String() matters — Mongo ids are objects, and comparing two objects
  //    with === is always false, which is what makes a list come back empty.
  const alreadyOnBoard = new Set(boardMembers.map((m) => String(m.user)));

  // 4. keep only the ones not already on the board
  return workspaceMembers.filter(
    (m) => m.user && !alreadyOnBoard.has(String(m.user._id))
  );
};

module.exports = {
  getMembers,
  createInvitation,
  getInvitationsForUser,
  respondToInvitation,
  getAddableMembers,
};