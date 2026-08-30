const { boards, boardMembers, workspaceMembers } = require("../../data/mock/boards");

// FR-13: View boards for a workspace ("all" returns every board)
const getBoardsByWorkspace = (workspaceId) => {
  if (!workspaceId || workspaceId === "all") {
    return [...boards];
  }
  return boards.filter((board) => board.workspaceId === workspaceId);
};

// Get one board
const getBoardById = (boardId) => {
  return boards.find((board) => board.id === boardId) || null;
};

// FR-12: Create board — creator becomes Board Admin
const createBoard = (workspaceId, boardData) => {
  const { name, description, workspaceName, currentUserId } = boardData;

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
};

// FR-14: Edit board
const updateBoard = (boardId, boardData) => {
  const board = boards.find((board) => board.id === boardId);

  if (!board) {
    return null;
  }

  if (boardData.name !== undefined) {
    board.name = boardData.name;
  }

  if (boardData.description !== undefined) {
    board.description = boardData.description;
  }

  board.updatedAt = new Date().toISOString();

  return board;
};

// FR-15: Delete board
const deleteBoard = (boardId) => {
  const index = boards.findIndex((board) => board.id === boardId);

  if (index === -1) {
    return null;
  }

  const deletedBoard = boards.splice(index, 1)[0];
  delete boardMembers[boardId];

  return deletedBoard;
};

// FR-19: View board members
const getBoardMembers = (boardId) => {
  return boardMembers[boardId] ? [...boardMembers[boardId]] : [];
};

// Members available to add = workspace members not already on the board (FR-17)
const getAddableMembers = (boardId, workspaceId) => {
  const current = boardMembers[boardId] || [];
  const currentIds = current.map((member) => member.id);
  const workspacePool = workspaceMembers[workspaceId] || [];

  return workspacePool.filter((member) => !currentIds.includes(member.id));
};

// FR-17: Add board member
const addBoardMember = (boardId, member) => {
  if (!boardMembers[boardId]) {
    boardMembers[boardId] = [];
  }

  boardMembers[boardId].push({ ...member, role: "Member" });

  return boardMembers[boardId];
};

// FR-18: Remove board member
const removeBoardMember = (boardId, memberId) => {
  boardMembers[boardId] = (boardMembers[boardId] || []).filter(
    (member) => member.id !== memberId
  );

  return boardMembers[boardId];
};

// FR-16: Change Board Admin (old admin becomes normal member, board never left without one)
const changeBoardAdmin = (boardId, newAdminId) => {
  const board = boards.find((board) => board.id === boardId);

  if (!board) {
    return null;
  }

  board.adminId = newAdminId;

  boardMembers[boardId] = (boardMembers[boardId] || []).map((member) => ({
    ...member,
    role: member.id === newAdminId ? "Admin" : "Member",
  }));

  return board;
};

module.exports = {
  getBoardsByWorkspace,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
  getBoardMembers,
  getAddableMembers,
  addBoardMember,
  removeBoardMember,
  changeBoardAdmin,
};