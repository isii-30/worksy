const {
  mockInvitations,
} = require("../../data/mock/invitations");

const mockNotifications = [
  {
    id: 2,
    type: "deadline",
    title: '"Create wireframes"',
    message: "03 days to go",
    createdAt: "30m ago",
    read: false,
    actions: false,
  },
  {
    id: 3,
    type: "task_created",
    title: 'Created a "New Task"',
    message: "",
    createdAt: "30m ago",
    read: true,
    actions: false,
  },
  {
    id: 4,
    type: "member_joined",
    title: 'A new member joined "Data & Analytics"',
    message: "",
    createdAt: "1h ago",
    read: true,
    actions: false,
  },
  {
    id: 5,
    type: "member_removed",
    title: 'You were removed from "Old Project"',
    message: "",
    createdAt: "2h ago",
    read: true,
    actions: false,
  },
  {
    id: 6,
    type: "deadline",
    title: '"API Integration"',
    message: "05 days to go",
    createdAt: "3h ago",
    read: true,
    actions: false,
  },
  {
    id: 7,
    type: "task_created",
    title: 'Created a "Presentation Task"',
    message: "",
    createdAt: "5h ago",
    read: true,
    actions: false,
  },
];

const getNotifications = (email) => {
  // Get pending invitations for this user
  const invitationNotifications = mockInvitations
    .filter(
      (invitation) =>
        invitation.email.toLowerCase() === email.toLowerCase() &&
        invitation.status === "pending"
    )
    .map((invitation) => ({
      id: invitation.id,
      type: "workspace_invitation",
      title: '"Online Marketing" Workspace Invitation',
      message: "You have been invited to join this workspace.",
      createdAt: "Just now",
      read: false,
      actions: true,

      // Keep the invitation ID so Accept/Decline can use it
      invitationId: invitation.id,
    }));

  return [
    ...invitationNotifications,
    ...mockNotifications,
  ];
};

module.exports = {
  getNotifications,
};