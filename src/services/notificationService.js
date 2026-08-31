const API_URL = "http://localhost:5000/api";

// Existing notifications
export const getNotifications = async () => {
  return [
    {
      id: "n1",
      type: "deadline",
      title: "Upcoming Deadline",
      message: "Project deadline is approaching",
      createdAt: "Today",
      read: false,
    },
    {
      id: "n2",
      type: "task_created",
      title: "New Task Created",
      message: "A new task has been added to your board",
      createdAt: "Yesterday",
      read: true,
    },
  ];
};


// Get workspace invitations for the current user
export const getInvitations = async (email) => {
  const response = await fetch(
    `${API_URL}/membership/invitations?email=${encodeURIComponent(email)}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load invitations");
  }

  return result.data || [];
};


// Accept or decline invitation
export const respondToInvitation = async (invitationId, action) => {
  const response = await fetch(
    `${API_URL}/membership/invitations/${invitationId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to respond to invitation"
    );
  }

  return result;
};