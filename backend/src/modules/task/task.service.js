const mongoose = require("mongoose");
const Task = require("./task.model");
const Column = require("../column/column.model");

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const categoryColors = {
  Design: "blue",
  Research: "green",
  Content: "orange",
  QA: "red",
  Development: "purple",
  Meeting: "gray",
};

const formatTask = (task) => {
  const data = task.toJSON();

  return {
    ...data,
    category: data.type,
    categoryColor:
      categoryColors[data.type] || "purple",
  };
};

// Get all tasks for a board
const getTasksByBoard = async (boardId) => {
  if (!isValidObjectId(boardId)) {
    return [];
  }

  const tasks = await Task.find({
    board: boardId,
  }).sort({
    position: 1,
    createdAt: 1,
  });

  return tasks.map(formatTask);
};

// Get one task
const getTaskById = async (taskId) => {
  if (!isValidObjectId(taskId)) {
    return null;
  }

  const task = await Task.findById(taskId);

  if (!task) {
    return null;
  }

  return formatTask(task);
};

// Create a task
const createTask = async (boardId, taskData) => {
  if (!isValidObjectId(boardId)) {
    throw new Error("Invalid board ID");
  }

  if (!isValidObjectId(taskData.createdBy)) {
    throw new Error("Invalid createdBy user ID");
  }

  const title = taskData.title?.trim();

  if (!title) {
    throw new Error("Task title is required");
  }

  let columnId = taskData.columnId;

  // If no column was supplied, use the first column
  if (!columnId) {
    const firstColumn = await Column.findOne({
      board: boardId,
    }).sort({
      position: 1,
    });

    if (!firstColumn) {
      throw new Error(
        "Cannot create task because this board has no columns"
      );
    }

    columnId = firstColumn._id;
  }

  if (!isValidObjectId(columnId)) {
    throw new Error("Invalid column ID");
  }

  const column = await Column.findOne({
    _id: columnId,
    board: boardId,
  });

  if (!column) {
    throw new Error(
      "Column does not belong to this board"
    );
  }

  // Put task at the end of the selected column
  const lastTask = await Task.findOne({
    board: boardId,
    column: column._id,
  }).sort({
    position: -1,
  });

  const position = lastTask
    ? lastTask.position + 1
    : 0;

  let dueDate = null;

  if (taskData.dueDate) {
    dueDate = new Date(taskData.dueDate);

    if (Number.isNaN(dueDate.getTime())) {
      throw new Error("Invalid due date");
    }
  }

  const task = await Task.create({
    board: boardId,
    column: column._id,
    title,
    type:
      taskData.type ||
      taskData.category ||
      "Development",
    dueDate,
    position,
    createdBy: taskData.createdBy,
    assignee: taskData.assignee || null,
    completed: Boolean(taskData.completed),
  });

  return formatTask(task);
};

// Update a task
const updateTask = async (taskId, taskData) => {
  if (!isValidObjectId(taskId)) {
    return null;
  }

  const task = await Task.findById(taskId);

  if (!task) {
    return null;
  }

  const update = {};

  if (taskData.title !== undefined) {
    const title = taskData.title.trim();

    if (!title) {
      throw new Error("Task title is required");
    }

    update.title = title;
  }

  if (taskData.type !== undefined) {
    update.type = taskData.type;
  }

  if (taskData.category !== undefined) {
    update.type = taskData.category;
  }

  if (taskData.dueDate !== undefined) {
    if (!taskData.dueDate) {
      update.dueDate = null;
    } else {
      const date = new Date(taskData.dueDate);

      if (Number.isNaN(date.getTime())) {
        throw new Error("Invalid due date");
      }

      update.dueDate = date;
    }
  }

  if (taskData.assignee !== undefined) {
    update.assignee = taskData.assignee || null;
  }

  if (taskData.position !== undefined) {
    update.position = Number(taskData.position);
  }

  // Allow changing a task's column
  if (taskData.columnId !== undefined) {
    if (!isValidObjectId(taskData.columnId)) {
      throw new Error("Invalid column ID");
    }

    const targetColumn = await Column.findOne({
      _id: taskData.columnId,
      board: task.board,
    });

    if (!targetColumn) {
      throw new Error(
        "Column does not belong to this board"
      );
    }

    update.column = targetColumn._id;

    // Automatically update completed status
    if (taskData.completed === undefined) {
      update.completed =
        targetColumn.color === "completed";
    }
  }

  if (taskData.completed !== undefined) {
    update.completed = Boolean(taskData.completed);
  }

  update.version = task.version + 1;

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    { $set: update },
    {
      new: true,
      runValidators: true,
    }
  );

  return updatedTask
    ? formatTask(updatedTask)
    : null;
};

// Delete a task
const deleteTask = async (taskId) => {
  if (!isValidObjectId(taskId)) {
    return null;
  }

  const deletedTask =
    await Task.findByIdAndDelete(taskId);

  return deletedTask
    ? formatTask(deletedTask)
    : null;
};

// Move a task to another column
const moveTask = async (taskId, columnId) => {
  if (
    !isValidObjectId(taskId) ||
    !isValidObjectId(columnId)
  ) {
    return null;
  }

  const task = await Task.findById(taskId);

  if (!task) {
    return null;
  }

  const targetColumn = await Column.findOne({
    _id: columnId,
    board: task.board,
  });

  if (!targetColumn) {
    throw new Error(
      "Target column does not belong to this board"
    );
  }

  const lastTask = await Task.findOne({
    board: task.board,
    column: targetColumn._id,
    _id: { $ne: task._id },
  }).sort({
    position: -1,
  });

  const newPosition = lastTask
    ? lastTask.position + 1
    : 0;

  task.column = targetColumn._id;
  task.position = newPosition;
  task.completed =
    targetColumn.color === "completed";
  task.version += 1;

  await task.save();

  return formatTask(task);
};

module.exports = {
  getTasksByBoard,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
};