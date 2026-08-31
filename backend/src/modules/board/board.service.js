const { mockBoards, mockBoardMembers, mockWorkspaceMembers } = require("../../data/mock/boards");

let boards = [...mockBoards];
let boardMembers = { ...mockBoardMembers };

function getBoards(workspaceId) {
  if (!workspaceId || workspaceId === "all") return [...boards];
  return boards.filter((b) => b.workspaceId === workspaceId);
}

function getBoardById(boardId) {
  return boards.find((b) => b.id === boardId) || null;
}

function createBoard({ name, description, workspaceId, workspaceName, currentUserId }) {
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
}

function updateBoard(boardId, { name, description }) {
  boards = boards.map((b) =>
    b.id === boardId ? { ...b, name, description, updatedAt: new Date().toISOString() } : b
  );
  return getBoardById(boardId);
}

function deleteBoard(boardId) {
  const existed = getBoardById(boardId);
  boards = boards.filter((b) => b.id !== boardId);
  delete boardMembers[boardId];
  return !!existed;
}

function getBoardMembers(boardId) {
  return boardMembers[boardId] ? [...boardMembers[boardId]] : [];
}

function getAddableMembers(boardId, workspaceId) {
  const current = boardMembers[boardId] || [];
  const currentIds = current.map((m) => m.id);
  const workspacePool = mockWorkspaceMembers[workspaceId] || [];
  return workspacePool.filter((m) => !currentIds.includes(m.id));
}

function addBoardMember(boardId, member) {
  if (!boardMembers[boardId]) boardMembers[boardId] = [];
  boardMembers[boardId].push({ ...member, role: "Member" });
  return boardMembers[boardId];
}

function removeBoardMember(boardId, memberId) {
  boardMembers[boardId] = (boardMembers[boardId] || []).filter((m) => m.id !== memberId);
  return boardMembers[boardId];
}

module.exports = {
  getBoards,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
  getBoardMembers,
  getAddableMembers,
  addBoardMember,
  removeBoardMember,
};