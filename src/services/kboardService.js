const API_BASE = "http://localhost:5000/api";

const request = async (path, options) => {
  const response = await fetch(`${API_BASE}${path}`, options);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Request failed");
  }

  return result.data;
};

export const boardService = {
  // Get boards for a workspace ("all" for every board)
  async getBoards(workspaceId) {
    const query = workspaceId && workspaceId !== "all" ? `?workspaceId=${workspaceId}` : "";
    return request(`/board${query}`);
  },

  async getBoardById(boardId) {
    return request(`/board/${boardId}`);
  },

  // Create board — creator becomes Board Admin
  async createBoard({ name, description, workspaceId, currentUserId }) {
    return request(`/board`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, workspaceId, currentUserId }),
    });
  },

  // Edit board
  async updateBoard(boardId, { name, description }) {
    return request(`/board/${boardId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
  },

  // Delete board
  async deleteBoard(boardId) {
    await request(`/board/${boardId}`, { method: "DELETE" });
    return true;
  },

  // View board members
  async getBoardMembers(boardId) {
    return request(`/board/${boardId}/members`);
  },

  // Workspace members not already on the board
  async getAddableMembers(boardId, workspaceId) {
    return request(`/board/${boardId}/available-members`);
  },

  // Add board member
  async addBoardMember(boardId, member) {
    return request(`/board/${boardId}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: member.userId || member.id, addedBy: member.addedBy }),
    });
  },

  // Remove board member
  async removeBoardMember(boardId, memberId) {
    return request(`/board/${boardId}/members/${memberId}`, { method: "DELETE" });
  },
};