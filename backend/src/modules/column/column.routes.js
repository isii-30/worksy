const express = require("express");
const columnController = require("./column.controller");

const router = express.Router();

// GET all columns for a board  → /api/column/board/:boardId
router.get("/board/:boardId", columnController.getColumns);

// GET one column  → /api/column/:columnId
router.get("/:columnId", columnController.getColumn);

// CREATE column  → /api/column/board/:boardId
router.post("/board/:boardId", columnController.createColumn);

// UPDATE column  → /api/column/:columnId
router.put("/:columnId", columnController.updateColumn);

// DELETE column  → /api/column/:columnId
router.delete("/:columnId", columnController.deleteColumn);

module.exports = router;