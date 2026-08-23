import { mockBoards, mockBoardMembers, mockWorkspaceMembers } from "../data/mock/boards";

// Simulates network latency so your loading states aren't lying to you
const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

let boards = [...mockBoards];
let boardMembers = { ...mockBoardMembers };

export const boardService = {
  // FR-13: View boards for a workspace
  async getBoards(workspaceId) {
    await delay();
    if (!workspaceId || workspaceId === "all") return [...boards];
    return boards.filter((b) => b.workspaceId === workspaceId);
  },

  async getBoardById(boardId) {
    await delay();
    return boards.find((b) => b.id === boardId) || null;
  },

  // FR-12: Create board — creator becomes Board Admin
  async createBoard({ name, description, workspaceId, workspaceName, currentUserId }) {
    await delay();
    const newBoard = {
      id: "b" + Date.now(),
      name,
      description,
      workspaceId,
      workspaceName,
      adminId: currentUserId,
      updatedAt: new Date().toISOString(),
    };
    boards.push(newBoard);
    boardMembers[newBoard.id] = [
      { id: currentUserId, name: "You", email: "", avatar: null, role: "Admin" },
    ];
    return newBoard;
  },

  // FR-14: Edit board
  async updateBoard(boardId, { name, description }) {
    await delay();
    boards = boards.map((b) =>
      b.id === boardId ? { ...b, name, description, updatedAt: new Date().toISOString() } : b
    );
    return boards.find((b) => b.id === boardId);
  },

  // FR-15: Delete board
  async deleteBoard(boardId) {
    await delay();
    boards = boards.filter((b) => b.id !== boardId);
    delete boardMembers[boardId];
    return true;
  },

  // FR-19: View board members
  async getBoardMembers(boardId) {
    await delay();
    return boardMembers[boardId] ? [...boardMembers[boardId]] : [];
  },

  // Members available to add = workspace members not already on the board (FR-17)
  async getAddableMembers(boardId, workspaceId) {
    await delay();
    const current = boardMembers[boardId] || [];
    const currentIds = current.map((m) => m.id);
    const workspacePool = mockWorkspaceMembers[workspaceId] || [];
    return workspacePool.filter((m) => !currentIds.includes(m.id));
  },

  // FR-17: Add board member
  async addBoardMember(boardId, member) {
    await delay();
    if (!boardMembers[boardId]) boardMembers[boardId] = [];
    boardMembers[boardId].push({ ...member, role: "Member" });
    return boardMembers[boardId];
  },

  // FR-18: Remove board member
  async removeBoardMember(boardId, memberId) {
    await delay();
    boardMembers[boardId] = (boardMembers[boardId] || []).filter((m) => m.id !== memberId);
    return boardMembers[boardId];
  },

  // FR-16: Change Board Admin (old admin becomes normal member, board never left without one)
  async changeBoardAdmin(boardId, newAdminId) {
    await delay();
    boards = boards.map((b) => (b.id === boardId ? { ...b, adminId: newAdminId } : b));
    boardMembers[boardId] = (boardMembers[boardId] || []).map((m) => ({
      ...m,
      role: m.id === newAdminId ? "Admin" : "Member",
    }));
    return boards.find((b) => b.id === boardId);
  },
};