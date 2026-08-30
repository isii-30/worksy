const express = require("express");
const boardController = require("./board.controller");

const router = express.Router();

// GET all boards for a workspace ("all" = every board)  → /api/board/workspace/:workspaceId
router.get("/workspace/:workspaceId", boardController.getBoards);

// CREATE board  → /api/board/workspace/:workspaceId
router.post("/workspace/:workspaceId", boardController.createBoard);

// GET board members  → /api/board/:boardId/members
router.get("/:boardId/members", boardController.getBoardMembers);

// ADD board member  → /api/board/:boardId/members
router.post("/:boardId/members", boardController.addBoardMember);

// REMOVE board member  → /api/board/:boardId/members/:memberId
router.delete("/:boardId/members/:memberId", boardController.removeBoardMember);

// GET workspace members not yet on the board  → /api/board/:boardId/addable-members?workspaceId=w1
router.get("/:boardId/addable-members", boardController.getAddableMembers);

// CHANGE board admin  → /api/board/:boardId/admin
router.patch("/:boardId/admin", boardController.changeBoardAdmin);

// GET one board  → /api/board/:boardId
router.get("/:boardId", boardController.getBoard);

// UPDATE board  → /api/board/:boardId
router.put("/:boardId", boardController.updateBoard);

// DELETE board  → /api/board/:boardId
router.delete("/:boardId", boardController.deleteBoard);

module.exports = router;