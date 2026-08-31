const tasks = require("../../data/mock/tasks");

// Get all tasks for a board
const getTasksByBoard = (boardId) => {
  return tasks.filter((task) => task.boardId === boardId);
};

// Get one task
const getTaskById = (taskId) => {
  return tasks.find((task) => task.id === Number(taskId));
};

// Create a task
const createTask = (boardId, taskData) => {
  const newTask = {
    id: tasks.length > 0
      ? Math.max(...tasks.map((task) => task.id)) + 1
      : 1,

    boardId,

    columnId: taskData.columnId || 1,
    title: taskData.title,
    category: taskData.category || "Development",
    categoryColor: taskData.categoryColor || "purple",
    dueDate: taskData.dueDate || "",
    completed: taskData.completed || false,
  };

  tasks.push(newTask);

  return newTask;
};

// Update a task
const updateTask = (taskId, taskData) => {
  const task = tasks.find((task) => task.id === Number(taskId));

  if (!task) {
    return null;
  }

  Object.assign(task, taskData);

  return task;
};

// Delete a task
const deleteTask = (taskId) => {
  const index = tasks.findIndex(
    (task) => task.id === Number(taskId)
  );

  if (index === -1) {
    return null;
  }

  const deletedTask = tasks.splice(index, 1);

  return deletedTask[0];
};

// Move task to another column
const moveTask = (taskId, columnId) => {
  const task = tasks.find(
    (task) => task.id === Number(taskId)
  );

  if (!task) {
    return null;
  }

  task.columnId = Number(columnId);

  // Automatically mark completed when moved to completed column
  if (Number(columnId) === 3) {
    task.completed = true;
  } else {
    task.completed = false;
  }

  return task;
};

module.exports = {
  getTasksByBoard,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
};