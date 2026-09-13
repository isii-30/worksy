const mongoose = require("mongoose");
const columnService = require("./column.service");

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// GET /api/column/board/:boardId
const getColumns = async (req, res) => {
  try {
    const { boardId } = req.params;

    if (!isValidObjectId(boardId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid board ID",
      });
    }

    const columns = await columnService.getColumnsByBoard(boardId);

    res.status(200).json({
      success: true,
      data: columns,
    });
  } catch (error) {
    console.error("Get columns error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve columns",
      error: error.message,
    });
  }
};

// GET /api/column/:columnId
const getColumn = async (req, res) => {
  try {
    const { columnId } = req.params;

    if (!isValidObjectId(columnId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid column ID",
      });
    }

    const column = await columnService.getColumnById(columnId);

    if (!column) {
      return res.status(404).json({
        success: false,
        message: "Column not found",
      });
    }

    res.status(200).json({
      success: true,
      data: column,
    });
  } catch (error) {
    console.error("Get column error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve column",
      error: error.message,
    });
  }
};

// POST /api/column/board/:boardId
const createColumn = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { title } = req.body;

    if (!isValidObjectId(boardId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid board ID",
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Column title is required",
      });
    }

    const column = await columnService.createColumn(
      boardId,
      req.body
    );

    res.status(201).json({
      success: true,
      data: column,
      message: "Column created successfully",
    });
  } catch (error) {
    console.error("Create column error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create column",
      error: error.message,
    });
  }
};

// PUT /api/column/:columnId
const updateColumn = async (req, res) => {
  try {
    const { columnId } = req.params;
    const { title } = req.body;

    if (!isValidObjectId(columnId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid column ID",
      });
    }

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Column title is required",
      });
    }

    const column = await columnService.updateColumn(
      columnId,
      req.body
    );

    if (!column) {
      return res.status(404).json({
        success: false,
        message: "Column not found",
      });
    }

    res.status(200).json({
      success: true,
      data: column,
      message: "Column updated successfully",
    });
  } catch (error) {
    console.error("Update column error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update column",
      error: error.message,
    });
  }
};

// DELETE /api/column/:columnId
const deleteColumn = async (req, res) => {
  try {
    const { columnId } = req.params;

    if (!isValidObjectId(columnId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid column ID",
      });
    }

    const column = await columnService.deleteColumn(columnId);

    if (!column) {
      return res.status(404).json({
        success: false,
        message: "Column not found",
      });
    }

    if (column.error === "COLUMN_NOT_EMPTY") {
      return res.status(409).json({
        success: false,
        message:
          "Cannot delete a column that contains tasks",
      });
    }

    res.status(200).json({
      success: true,
      data: column,
      message: "Column deleted successfully",
    });
  } catch (error) {
    console.error("Delete column error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete column",
      error: error.message,
    });
  }
};

module.exports = {
  getColumns,
  getColumn,
  createColumn,
  updateColumn,
  deleteColumn,
};