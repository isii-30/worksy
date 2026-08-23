import {mockColumns} from "../data/mock/columns";

export const getColumns = () => {
  return Promise.resolve(mockColumns);
};

export const createColumn = (column) => {
  console.log("Frontend mock create column:", column);
  return Promise.resolve(column);
};

export const updateColumn = (column) => {
  console.log("Frontend mock update column:", column);
  return Promise.resolve(column);
};

export const deleteColumn = (columnId) => {
  console.log("Frontend mock delete column:", columnId);
  return Promise.resolve(columnId);
};