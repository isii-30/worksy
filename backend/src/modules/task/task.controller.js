const mongoose = require("mongoose");
const taskService = require("./task.service");

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// GET /api/task/board/:boardId
const getTasks = async (req, res) => {
  try {
    const { boardId } = req.params;

    if (!isValidObjectId(boardId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid board ID",
      });
    }

    const tasks =
      await taskService.getTasksByBoard(boardId);

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve tasks",
      error: error.message,
    });
  }
};

// GET /api/task/:taskId
const getTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!isValidObjectId(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task =
      await taskService.getTaskById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("Get task error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve task",
      error: error.message,
    });
  }
};

// POST /api/task/board/:boardId
const createTask = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { title, createdBy } = req.body;

    if (!isValidObjectId(boardId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid board ID",
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    if (!createdBy) {
      return res.status(400).json({
        success: false,
        message: "createdBy is required",
      });
    }

    if (!isValidObjectId(createdBy)) {
      return res.status(400).json({
        success: false,
        message: "Invalid createdBy user ID",
      });
    }

    const task =
      await taskService.createTask(
        boardId,
        req.body
      );

    res.status(201).json({
      success: true,
      data: task,
      message: "Task created successfully",
    });
  } catch (error) {
    console.error("Create task error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create task",
      error: error.message,
    });
  }
};

// PUT /api/task/:taskId
const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!isValidObjectId(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task =
      await taskService.updateTask(
        taskId,
        req.body
      );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: task,
      message: "Task updated successfully",
    });
  } catch (error) {
    console.error("Update task error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update task",
      error: error.message,
    });
  }
};

// DELETE /api/task/:taskId
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!isValidObjectId(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task =
      await taskService.deleteTask(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: task,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete task",
      error: error.message,
    });
  }
};

// PATCH /api/task/:taskId/move
const moveTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { columnId } = req.body;

    if (!isValidObjectId(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    if (!columnId) {
      return res.status(400).json({
        success: false,
        message: "columnId is required",
      });
    }

    if (!isValidObjectId(columnId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid column ID",
      });
    }

    const task =
      await taskService.moveTask(
        taskId,
        columnId
      );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: task,
      message: "Task moved successfully",
    });
  } catch (error) {
    console.error("Move task error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to move task",
      error: error.message,
    });
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
};