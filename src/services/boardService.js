const API_BASE = "http://localhost:5000/api";

async function handleResponse(res) {
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Something went wrong");
  }
  return json.data;
}

export const boardService = {
  async getBoards(workspaceId) {
    const query = workspaceId && workspaceId !== "all" ? `?workspaceId=${workspaceId}` : "";
    const res = await fetch(`${API_BASE}/board${query}`);
    return handleResponse(res);
  },

  async getBoardById(boardId) {
    const res = await fetch(`${API_BASE}/board/${boardId}`);
    return handleResponse(res);
  },

  async createBoard({ name, description, workspaceId, workspaceName, currentUserId }) {
    const res = await fetch(`${API_BASE}/board`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, workspaceId, workspaceName, currentUserId }),
    });
    return handleResponse(res);
  },

  async updateBoard(boardId, { name, description }) {
    const res = await fetch(`${API_BASE}/board/${boardId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
    return handleResponse(res);
  },

  async deleteBoard(boardId) {
    const res = await fetch(`${API_BASE}/board/${boardId}`, { method: "DELETE" });
    return handleResponse(res);
  },

  async getBoardMembers(boardId) {
    const res = await fetch(`${API_BASE}/board/${boardId}/members`);
    return handleResponse(res);
  },

  async getAddableMembers(boardId) {
    const res = await fetch(`${API_BASE}/board/${boardId}/available-members`);
    return handleResponse(res);
  },

  async addBoardMember(boardId, member) {
    const res = await fetch(`${API_BASE}/board/${boardId}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(member),
    });
    return handleResponse(res);
  },

  async removeBoardMember(boardId, memberId) {
    const res = await fetch(`${API_BASE}/board/${boardId}/members/${memberId}`, {
      method: "DELETE",
    });
    return handleResponse(res);
  },
};