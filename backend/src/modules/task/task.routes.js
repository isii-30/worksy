const express = require("express");
const taskController = require("./task.controller");

const router = express.Router();

// GET all tasks for a board  → /api/task/board/:boardId
router.get("/board/:boardId", taskController.getTasks);

// GET one task  → /api/task/:taskId
router.get("/:taskId", taskController.getTask);

// CREATE task  → /api/task/board/:boardId
router.post("/board/:boardId", taskController.createTask);

// UPDATE task  → /api/task/:taskId
router.put("/:taskId", taskController.updateTask);

// DELETE task  → /api/task/:taskId
router.delete("/:taskId", taskController.deleteTask);

// MOVE task  → /api/task/:taskId/move
router.patch("/:taskId/move", taskController.moveTask);

module.exports = router;