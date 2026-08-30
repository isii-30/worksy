const columnService = require("./column.service");


// GET /api/boards/:boardId/columns
const getColumns = (req, res) => {
  try {
    const { boardId } = req.params;

    const columns = columnService.getColumnsByBoard(boardId);

    res.status(200).json({
      success: true,
      data: columns,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve columns",
      error: error.message,
    });
  }
};


// GET /api/columns/:columnId
const getColumn = (req, res) => {
  try {
    const { columnId } = req.params;

    const column = columnService.getColumnById(columnId);

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
    res.status(500).json({
      success: false,
      message: "Failed to retrieve column",
      error: error.message,
    });
  }
};


// POST /api/boards/:boardId/columns
const createColumn = (req, res) => {
  try {
    const { boardId } = req.params;
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Column title is required",
      });
    }

    const column = columnService.createColumn(
      boardId,
      req.body
    );

    res.status(201).json({
      success: true,
      data: column,
      message: "Column created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create column",
      error: error.message,
    });
  }
};


// PUT /api/columns/:columnId
const updateColumn = (req, res) => {
  try {
    const { columnId } = req.params;
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Column title is required",
      });
    }

    const column = columnService.updateColumn(
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
    res.status(500).json({
      success: false,
      message: "Failed to update column",
      error: error.message,
    });
  }
};


// DELETE /api/columns/:columnId
const deleteColumn = (req, res) => {
  try {
    const { columnId } = req.params;

    const column = columnService.deleteColumn(columnId);

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