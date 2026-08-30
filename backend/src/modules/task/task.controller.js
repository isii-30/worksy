const taskService = require("./task.service");

// GET /api/boards/:boardId/tasks
const getTasks = (req, res) => {
  try {
    const { boardId } = req.params;

    const tasks = taskService.getTasksByBoard(boardId);

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve tasks",
      error: error.message,
    });
  }
};

// GET /api/tasks/:taskId
const getTask = (req, res) => {
  try {
    const { taskId } = req.params;

    const task = taskService.getTaskById(taskId);

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
    res.status(500).json({
      success: false,
      message: "Failed to retrieve task",
      error: error.message,
    });
  }
};

// POST /api/boards/:boardId/tasks
const createTask = (req, res) => {
  try {
    const { boardId } = req.params;

    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    const task = taskService.createTask(boardId, req.body);

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create task",
      error: error.message,
    });
  }
};

// PUT /api/tasks/:taskId
const updateTask = (req, res) => {
  try {
    const { taskId } = req.params;

    const task = taskService.updateTask(taskId, req.body);

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
    res.status(500).json({
      success: false,
      message: "Failed to update task",
      error: error.message,
    });
  }
};

// DELETE /api/tasks/:taskId
const deleteTask = (req, res) => {
  try {
    const { taskId } = req.params;

    const task = taskService.deleteTask(taskId);

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
    res.status(500).json({
      success: false,
      message: "Failed to delete task",
      error: error.message,
    });
  }
};

// PATCH /api/tasks/:taskId/move
const moveTask = (req, res) => {
  try {
    const { taskId } = req.params;
    const { columnId } = req.body;

    if (!columnId) {
      return res.status(400).json({
        success: false,
        message: "columnId is required",
      });
    }

    const task = taskService.moveTask(taskId, columnId);

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