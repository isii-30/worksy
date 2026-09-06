const mongoose = require("mongoose");
const Column = require("./column.model");
const Task = require("../task/task.model");

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Convert MongoDB column document into the format expected by React
const formatColumn = (column, count = 0) => {
  return {
    id: column._id.toString(),
    boardId: column.board.toString(),
    title: column.title,
    color: column.color,
    position: column.position,
    count,
  };
};

// Get all columns belonging to a board
const getColumnsByBoard = async (boardId) => {
  if (!isValidObjectId(boardId)) {
    return [];
  }

  const columns = await Column.find({
    board: boardId,
  }).sort({
    position: 1,
  });

  const result = [];

  for (const column of columns) {
    const count = await Task.countDocuments({
      board: boardId,
      column: column._id,
    });

    result.push(formatColumn(column, count));
  }

  return result;
};

// Get one column
const getColumnById = async (columnId) => {
  if (!isValidObjectId(columnId)) {
    return null;
  }

  const column = await Column.findById(columnId);

  if (!column) {
    return null;
  }

  const count = await Task.countDocuments({
    column: column._id,
  });

  return formatColumn(column, count);
};

// Create a column
const createColumn = async (boardId, columnData) => {
  if (!isValidObjectId(boardId)) {
    throw new Error("Invalid board ID");
  }

  const title = columnData.title?.trim();

  if (!title) {
    throw new Error("Column title is required");
  }

  // Put the new column at the end
  const lastColumn = await Column.findOne({
    board: boardId,
  }).sort({
    position: -1,
  });

  const position = lastColumn ? lastColumn.position + 1 : 0;

  const column = await Column.create({
    board: boardId,
    title,
    color: columnData.color || "todo",
    position,
  });

  return formatColumn(column, 0);
};

// Update a column
const updateColumn = async (columnId, columnData) => {
  if (!isValidObjectId(columnId)) {
    return null;
  }

  const column = await Column.findById(columnId);

  if (!column) {
    return null;
  }

  if (columnData.title !== undefined) {
    const title = columnData.title.trim();

    if (!title) {
      throw new Error("Column title is required");
    }

    column.title = title;
  }

  if (columnData.color !== undefined) {
    column.color = columnData.color;
  }

  if (columnData.position !== undefined) {
    column.position = Number(columnData.position);
  }

  await column.save();

  const count = await Task.countDocuments({
    column: column._id,
  });

  return formatColumn(column, count);
};

// Delete a column
const deleteColumn = async (columnId) => {
  if (!isValidObjectId(columnId)) {
    return null;
  }

  const column = await Column.findById(columnId);

  if (!column) {
    return null;
  }

  // Do not allow deletion when tasks still exist
  const taskCount = await Task.countDocuments({
    column: column._id,
  });

  if (taskCount > 0) {
    return {
      error: "COLUMN_NOT_EMPTY",
    };
  }

  await Column.findByIdAndDelete(columnId);

  return formatColumn(column, 0);
};

module.exports = {
  getColumnsByBoard,
  getColumnById,
  createColumn,
  updateColumn,
  deleteColumn,
};