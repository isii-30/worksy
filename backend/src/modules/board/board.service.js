const Board = require("./board.model");
const BoardMember = require("./boardMember.model");
const Column = require("../column/column.model");

async function getBoards(workspaceId) {
  if (!workspaceId || workspaceId === "all") {
    return Board.find().sort({ createdAt: -1 });
  }
  return Board.find({ workspace: workspaceId }).sort({ createdAt: -1 });
}

async function getBoardById(boardId) {
  return Board.findById(boardId);
}

async function createBoard({ name, description, workspaceId, currentUserId }) {
  const board = await Board.create({
    name,
    description,
    workspace: workspaceId,
    createdBy: currentUserId,
  });

  await BoardMember.create({
    board: board._id,
    user: currentUserId,
    role: "admin",
    addedBy: currentUserId,
  });

  // Create the three default columns so the board isn't empty
  // and the dashboard stat cards work (they read column.color).
  await Column.create([
    { board: board._id, title: "To Do", color: "todo", position: 0 },
    { board: board._id, title: "In Progress", color: "progress", position: 1 },
    { board: board._id, title: "Completed", color: "completed", position: 2 },
  ]);

  return board;
}

async function updateBoard(boardId, { name, description }) {
  return Board.findByIdAndUpdate(
    boardId,
    { name, description },
    { new: true }
  );
}

async function deleteBoard(boardId) {
  const deleted = await Board.findByIdAndDelete(boardId);
  if (deleted) {
    await BoardMember.deleteMany({ board: boardId });
    await Column.deleteMany({ board: boardId });
  }
  return !!deleted;
}

async function getBoardMembers(boardId) {
  return BoardMember.find({ board: boardId }).populate(
    "user",
    "firstName lastName email profileImage"
  );
}

async function getAddableMembers(boardId, workspaceId) {
  // TODO: once Membership module's model exists, replace this with a real
  // query for "workspace members not already on this board". For now this
  // returns an empty list as a safe placeholder so the endpoint doesn't crash.
  return [];
}

async function addBoardMember(boardId, userId, addedBy) {
  return BoardMember.create({
    board: boardId,
    user: userId,
    role: "member",
    addedBy,
  });
}

async function removeBoardMember(boardId, userId) {
  await BoardMember.deleteOne({ board: boardId, user: userId });
  return BoardMember.find({ board: boardId });
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