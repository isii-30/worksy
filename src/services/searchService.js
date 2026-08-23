export const searchTasks = (tasks, searchText) => {
  if (!searchText.trim()) {
    return tasks;
  }

  return tasks.filter((task) =>
    task.title
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );
};