const API_BASE = "http://localhost:5000/api";


// Get all columns for a board
export const getColumns = async (boardId) => {
  const response = await fetch(
    `${API_BASE}/column/board/${boardId}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch columns"
    );
  }

  return result.data;
};


// Get one column
export const getColumn = async (columnId) => {
  const response = await fetch(
    `${API_BASE}/column/${columnId}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch column"
    );
  }

  return result.data;
};


// Create column
export const createColumn = async (boardId, column) => {
  const response = await fetch(
    `${API_BASE}/column/board/${boardId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(column),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to create column"
    );
  }

  return result.data;
};


// Update column
export const updateColumn = async (columnId, column) => {
  const response = await fetch(
    `${API_BASE}/column/${columnId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(column),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to update column"
    );
  }

  return result.data;
};


// Delete column
export const deleteColumn = async (columnId) => {
  const response = await fetch(
    `${API_BASE}/column/${columnId}`,
    {
      method: "DELETE",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to delete column"
    );
  }

  return result.data;
};