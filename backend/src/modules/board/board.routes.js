const express = require("express");
const router = express.Router();
const boardController = require("./board.controller");



router.get("/", boardController.getBoards);
router.get("/:boardId", boardController.getBoard);
router.post("/", boardController.createBoard);
router.put("/:boardId", boardController.updateBoard);
router.delete("/:boardId", boardController.deleteBoard);

router.get("/:boardId/members", boardController.getBoardMembers);
router.get("/:boardId/available-members", boardController.getAvailableMembers);
router.post("/:boardId/members", boardController.addBoardMember);
router.delete("/:boardId/members/:userId", boardController.removeBoardMember);

module.exports = router;