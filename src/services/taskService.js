import {mockTasks} from "../data/mock/tasks";

export const getTasks = () => {
  return Promise.resolve(mockTasks);
};

export const getTasksByColumn = (columnId) => {
  return Promise.resolve(
    mockTasks.filter((task) => task.columnId === columnId)
  );
};

export const createTask = (task) => {
  console.log("Frontend mock create task:", task);
  return Promise.resolve(task);
};

export const deleteTask = (taskId) => {
  console.log("Frontend mock delete task:", taskId);
  return Promise.resolve(taskId);
};