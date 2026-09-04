const boardService = require("./board.service");

async function getBoards(req, res) {
  const workspaceId = req.query.workspaceId || "all";
  const boards = await boardService.getBoards(workspaceId);
  res.json({ success: true, data: boards });
}

async function getBoard(req, res) {
  const board = await boardService.getBoardById(req.params.boardId);
  if (!board) {
    return res.status(404).json({ success: false, message: "Board not found" });
  }
  res.json({ success: true, data: board });
}

async function createBoard(req, res) {
  const { name, description, workspaceId } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: "Board name is required" });
  }
  if (!workspaceId) {
    return res.status(400).json({ success: false, message: "workspaceId is required" });
  }
  const board = await boardService.createBoard({
    name,
    description,
    workspaceId,
    currentUserId: req.body.currentUserId || "u1", // TODO: replace with real auth user
  });
  res.status(201).json({ success: true, data: board });
}

async function updateBoard(req, res) {
  const existing = await boardService.getBoardById(req.params.boardId);
  if (!existing) {
    return res.status(404).json({ success: false, message: "Board not found" });
  }
  const updated = await boardService.updateBoard(req.params.boardId, req.body);
  res.json({ success: true, data: updated });
}

async function deleteBoard(req, res) {
  const deleted = await boardService.deleteBoard(req.params.boardId);
  if (!deleted) {
    return res.status(404).json({ success: false, message: "Board not found" });
  }
  res.json({ success: true, message: "Board deleted" });
}

async function getBoardMembers(req, res) {
  const board = await boardService.getBoardById(req.params.boardId);
  if (!board) {
    return res.status(404).json({ success: false, message: "Board not found" });
  }
  const members = await boardService.getBoardMembers(req.params.boardId);
  res.json({ success: true, data: members });
}

async function getAvailableMembers(req, res) {
  const board = await boardService.getBoardById(req.params.boardId);
  if (!board) {
    return res.status(404).json({ success: false, message: "Board not found" });
  }
  const available = await boardService.getAddableMembers(req.params.boardId, board.workspace);
  res.json({ success: true, data: available });
}

async function addBoardMember(req, res) {
  const board = await boardService.getBoardById(req.params.boardId);
  if (!board) {
    return res.status(404).json({ success: false, message: "Board not found" });
  }
  if (!req.body.userId) {
    return res.status(400).json({ success: false, message: "userId is required" });
  }
  const member = await boardService.addBoardMember(
    req.params.boardId,
    req.body.userId,
    req.body.addedBy || "u1" // TODO: replace with real auth user
  );
  res.status(201).json({ success: true, data: member });
}

async function removeBoardMember(req, res) {
  const members = await boardService.removeBoardMember(req.params.boardId, req.params.userId);
  res.json({ success: true, data: members });
}

module.exports = {
  getBoards,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
  getBoardMembers,
  getAvailableMembers,
  addBoardMember,
  removeBoardMember,
};