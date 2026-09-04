const Column = require('./column.model');

// Fetch columns for a specific board sorted by position
const getColumnsByBoard = async (boardId) => {
  return await Column.find({ board: boardId }).sort({ position: 1 });
};

// Create a new column
const createColumn = async (columnData) => {
  const column = new Column(columnData);
  return await column.save();
};

// Update an existing column by ID
const updateColumn = async (columnId, updateData) => {
  return await Column.findByIdAndUpdate(columnId, updateData, { new: true });
};

// Delete a column by ID
const deleteColumn = async (columnId) => {
  return await Column.findByIdAndDelete(columnId);
};

module.exports = {
  getColumnsByBoard,
  createColumn,
  updateColumn,
  deleteColumn,
};