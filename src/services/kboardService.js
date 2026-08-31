const API_BASE = "http://localhost:5000/api";

// Small helper so every call doesn't repeat the same fetch/json/error dance
const request = async (path, options) => {
  const response = await fetch(`${API_BASE}${path}`, options);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Request failed");
  }

  return result.data;
};

export const boardService = {
  // FR-13: View boards for a workspace
  async getBoards(workspaceId) {
    return request(`/board/workspace/${workspaceId || "all"}`);
  },

  async getBoardById(boardId) {
    return request(`/board/${boardId}`);
  },

  // FR-12: Create board — creator becomes Board Admin
  async createBoard({ name, description, workspaceId, workspaceName, currentUserId }) {
    return request(`/board/workspace/${workspaceId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, workspaceName, currentUserId }),
    });
  },

  // FR-14: Edit board
  async updateBoard(boardId, { name, description }) {
    return request(`/board/${boardId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
  },

  // FR-15: Delete board
  async deleteBoard(boardId) {
    await request(`/board/${boardId}`, { method: "DELETE" });
    return true;
  },

  // FR-19: View board members
  async getBoardMembers(boardId) {
    return request(`/board/${boardId}/members`);
  },

  // Members available to add = workspace members not already on the board (FR-17)
  async getAddableMembers(boardId, workspaceId) {
    return request(`/board/${boardId}/addable-members?workspaceId=${workspaceId}`);
  },

  // FR-17: Add board member
  async addBoardMember(boardId, member) {
    return request(`/board/${boardId}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(member),
    });
  },

  // FR-18: Remove board member
  async removeBoardMember(boardId, memberId) {
    return request(`/board/${boardId}/members/${memberId}`, { method: "DELETE" });
  },

  // FR-16: Change Board Admin (old admin becomes normal member, board never left without one)
  async changeBoardAdmin(boardId, newAdminId) {
    return request(`/board/${boardId}/admin`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newAdminId }),
    });
  },
};