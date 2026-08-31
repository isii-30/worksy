const API_BASE = "http://localhost:5000/api";

// Get all tasks for a board
export const getTasks = async (boardId) => {
  const response = await fetch(
    `${API_BASE}/task/board/${boardId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  const result = await response.json();

  return result.data;
};

// Get one task
export const getTask = async (taskId) => {
  const response = await fetch(
    `${API_BASE}/task/${taskId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch task");
  }

  const result = await response.json();

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

  if (!response.ok) {
    throw new Error("Failed to create task");
  }

  const result = await response.json();

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

  if (!response.ok) {
    throw new Error("Failed to update task");
  }

  const result = await response.json();

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

  if (!response.ok) {
    throw new Error("Failed to delete task");
  }

  const result = await response.json();

  return result.data;
};

// Move task
export const moveTask = async (taskId, columnId) => {
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

  if (!response.ok) {
    throw new Error("Failed to move task");
  }

  const result = await response.json();

  return result.data;
};