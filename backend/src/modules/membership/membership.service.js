const {
  mockMembers,
  mockRegisteredUsers,
} = require("../../data/mock/members");

const {
  mockWorkspaceBoards,
} = require("../../data/mock/memberBoardNames");

const {
  mockInvitations,
} = require("../../data/mock/invitations");

// Get all workspace members
const getMembers = () => {
  return mockMembers;
};

// Get all board names
const getBoardNames = () => {
  return mockWorkspaceBoards;
};

// Send an invitation to a registered Worksy user
const createInvitation = (email) => {
  // Find the registered user by email
  const user = mockRegisteredUsers.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );

  // User does not have a Worksy account
  if (!user) {
    return {
      error: "USER_NOT_FOUND",
      message: "No registered Worksy user found with this email.",
    };
  }

  // Check whether the user is already a workspace member
  const existingMember = mockMembers.find(
    (member) => member.id === user.id
  );

  if (existingMember) {
    return {
      error: "ALREADY_MEMBER",
      message: "This user is already a workspace member.",
    };
  }

  // Check whether the user already has a pending invitation
  const existingInvitation = mockInvitations.find(
    (invitation) =>
      invitation.userId === user.id &&
      invitation.status === "pending"
  );

  if (existingInvitation) {
    return {
      error: "INVITATION_EXISTS",
      message: "This user already has a pending invitation.",
    };
  }

  // Create the invitation
  const invitation = {
    id: `inv${mockInvitations.length + 1}`,
    workspaceId: "w1",
    userId: user.id,
    email: user.email,
    name: user.name,
    status: "pending",
  };

  // Store invitation in mock data
  mockInvitations.push(invitation);

  return {
    invitation,
  };
};

// Get invitations for a specific email
const getInvitationsByEmail = (email) => {
  return mockInvitations.filter(
    (invitation) =>
      invitation.email.toLowerCase() === email.toLowerCase()
  );
};

// Accept or decline an invitation
const respondToInvitation = (invitationId, action) => {
  // Find the invitation
  const invitation = mockInvitations.find(
    (invitation) => invitation.id === invitationId
  );

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
    const user = mockRegisteredUsers.find(
      (user) => user.id === invitation.userId
    );

    if (!user) {
      return {
        error: "USER_NOT_FOUND",
        message: "Registered user not found.",
      };
    }

    // Add the user to workspace members
    const newMember = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: "Member",
      board: null,
      image: user.image || null,
    };

    mockMembers.push(newMember);

    // Update invitation status
    invitation.status = "accepted";

    return {
      invitation,
      member: newMember,
    };
  }

  // Decline invitation
  if (action === "decline") {
    invitation.status = "declined";

    return {
      invitation,
    };
  }

  // Invalid action
  return {
    error: "INVALID_ACTION",
    message: "Action must be either 'accept' or 'decline'.",
  };
};

module.exports = {
  getMembers,
  getBoardNames,
  createInvitation,
  getInvitationsByEmail,
  respondToInvitation,
};