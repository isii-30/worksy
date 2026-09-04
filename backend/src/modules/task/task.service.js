const Task = require('./task.model');

// Fetch tasks for a board (or specific column) sorted by position
const getTasksByBoard = async (boardId) => {
  return await Task.find({ board: boardId })
    .populate('createdBy', 'name email')
    .populate('assignee', 'name email')
    .sort({ position: 1 });
};

// Create a new task
const createTask = async (taskData) => {
  const task = new Task(taskData);
  return await task.save();
};

// Update a task and increment its version
const updateTask = async (taskId, updateData) => {
  return await Task.findByIdAndUpdate(
    taskId,
    { $set: updateData, $inc: { version: 1 } },
    { new: true }
  );
};

// Delete a task by ID
const deleteTask = async (taskId) => {
  return await Task.findByIdAndDelete(taskId);
};

module.exports = {
  getTasksByBoard,
  createTask,
  updateTask,
  deleteTask,
};