const boardService = require("./board.service");

function getBoards(req, res) {
  const workspaceId = req.query.workspaceId || "all";
  const boards = boardService.getBoards(workspaceId);
  res.json({ success: true, data: boards });
}

function getBoard(req, res) {
  const board = boardService.getBoardById(req.params.boardId);
  if (!board) {
    return res.status(404).json({ success: false, message: "Board not found" });
  }
  res.json({ success: true, data: board });
}

function createBoard(req, res) {
  const { name, description, workspaceId, workspaceName } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: "Board name is required" });
  }
  if (!workspaceId) {
    return res.status(400).json({ success: false, message: "workspaceId is required" });
  }
  const board = boardService.createBoard({
    name,
    description,
    workspaceId,
    workspaceName: workspaceName || "",
    currentUserId: req.body.currentUserId || "u1", // TODO: replace with real auth user
  });
  res.status(201).json({ success: true, data: board });
}

function updateBoard(req, res) {
  const existing = boardService.getBoardById(req.params.boardId);
  if (!existing) {
    return res.status(404).json({ success: false, message: "Board not found" });
  }
  const updated = boardService.updateBoard(req.params.boardId, req.body);
  res.json({ success: true, data: updated });
}

function deleteBoard(req, res) {
  const deleted = boardService.deleteBoard(req.params.boardId);
  if (!deleted) {
    return res.status(404).json({ success: false, message: "Board not found" });
  }
  res.json({ success: true, message: "Board deleted" });
}

function getBoardMembers(req, res) {
  const board = boardService.getBoardById(req.params.boardId);
  if (!board) {
    return res.status(404).json({ success: false, message: "Board not found" });
  }
  const members = boardService.getBoardMembers(req.params.boardId);
  res.json({ success: true, data: members });
}

function getAvailableMembers(req, res) {
  const board = boardService.getBoardById(req.params.boardId);
  if (!board) {
    return res.status(404).json({ success: false, message: "Board not found" });
  }
  const available = boardService.getAddableMembers(req.params.boardId, board.workspaceId);
  res.json({ success: true, data: available });
}

function addBoardMember(req, res) {
  const board = boardService.getBoardById(req.params.boardId);
  if (!board) {
    return res.status(404).json({ success: false, message: "Board not found" });
  }
  const available = boardService.getAddableMembers(req.params.boardId, board.workspaceId);
  const candidate = available.find((m) => m.id === req.body.id);
  if (!candidate) {
    return res.status(400).json({
      success: false,
      message: "User must belong to this board's workspace before being added",
    });
  }
  const members = boardService.addBoardMember(req.params.boardId, candidate);
  res.status(201).json({ success: true, data: members });
}

function removeBoardMember(req, res) {
  const members = boardService.removeBoardMember(req.params.boardId, req.params.userId);
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