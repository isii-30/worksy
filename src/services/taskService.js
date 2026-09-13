
const API_BASE = "http://localhost:5000/api";

// Get all tasks for a board
export const getTasks = async (boardId) => {
  const response = await fetch(
    `${API_BASE}/task/board/${boardId}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch tasks"
    );
  }

  return result.data;
};

// Get one task
export const getTask = async (taskId) => {
  const response = await fetch(
    `${API_BASE}/task/${taskId}`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch task"
    );
  }

  return result.data;
};

// Create task
export const createTask = async (boardId, task) => {
  const response = await fetch(
    `${API_BASE}/task/board/${boardId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to create task"
    );
  }

  return result.data;
};

// Update task
export const updateTask = async (taskId, task) => {
  const response = await fetch(
    `${API_BASE}/task/${taskId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to update task"
    );
  }

  return result.data;
};

// Delete task
export const deleteTask = async (taskId) => {
  const response = await fetch(
    `${API_BASE}/task/${taskId}`,
    {
      method: "DELETE",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to delete task"
    );
  }

  return result.data;
};

// Move task to another column
export const moveTask = async (
  taskId,
  columnId
) => {
  const response = await fetch(
    `${API_BASE}/task/${taskId}/move`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        columnId,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to move task"
    );
  }

  return result.data;
};

