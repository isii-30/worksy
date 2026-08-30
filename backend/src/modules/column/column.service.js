const columns = require("../../data/mock/columns");
const tasks = require("../../data/mock/tasks");

// Get all columns belonging to a board
const getColumnsByBoard = (boardId) => {
  return columns
    .filter((column) => column.boardId === boardId)
    .map((column) => ({
      ...column,

      // Calculate task count dynamically
      count: tasks.filter(
        (task) =>
          task.boardId === boardId &&
          task.columnId === column.id
      ).length,
    }));
};


// Get one column
const getColumnById = (columnId) => {
  const column = columns.find(
    (column) => column.id === Number(columnId)
  );

  if (!column) {
    return null;
  }

  return {
    ...column,

    count: tasks.filter(
      (task) => task.columnId === column.id
    ).length,
  };
};


// Create a column
const createColumn = (boardId, columnData) => {
  const newId =
    columns.length > 0
      ? Math.max(...columns.map((column) => column.id)) + 1
      : 1;

  const newColumn = {
    id: newId,
    boardId,
    title: columnData.title.trim(),
    color: columnData.color || "todo",
  };

  columns.push(newColumn);

  return {
    ...newColumn,
    count: 0,
  };
};


// Update a column
const updateColumn = (columnId, columnData) => {
  const column = columns.find(
    (column) => column.id === Number(columnId)
  );

  if (!column) {
    return null;
  }

  if (columnData.title !== undefined) {
    column.title = columnData.title.trim();
  }

  if (columnData.color !== undefined) {
    column.color = columnData.color;
  }

  return getColumnById(columnId);
};


// Delete a column
const deleteColumn = (columnId) => {
  const numericColumnId = Number(columnId);

  const index = columns.findIndex(
    (column) => column.id === numericColumnId
  );

  if (index === -1) {
    return null;
  }

  // Don't allow deleting a column containing tasks
  const hasTasks = tasks.some(
    (task) => task.columnId === numericColumnId
  );

  if (hasTasks) {
    return {
      error: "COLUMN_NOT_EMPTY",
    };
  }

  const deletedColumn = columns.splice(index, 1);

  return deletedColumn[0];
};


module.exports = {
  getColumnsByBoard,
  getColumnById,
  createColumn,
  updateColumn,
  deleteColumn,
};