const API_BASE_URL = "http://localhost:5000/api/membership";

// Get all workspace members
export const getMembers = async () => {
  const response = await fetch(`${API_BASE_URL}/members`);

  if (!response.ok) {
    throw new Error("Failed to fetch members");
  }

  const result = await response.json();

  return result.data;
};

// Get all workspace boards
export const getWorkspaceBoards = async () => {
  const response = await fetch(`${API_BASE_URL}/boards`);

  if (!response.ok) {
    throw new Error("Failed to fetch workspace boards");
  }

  const result = await response.json();

  return result.data;
};
// Send an invitation
export const inviteMember = async (email) => {
  const response = await fetch(`${API_BASE_URL}/invitations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to send invitation");
  }

  return result;
};