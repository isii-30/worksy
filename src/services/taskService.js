const API_BASE = "http://localhost:5000/api";

// Reads the token Senali's login flow saves in the browser, and attaches
// it so the routes protected by requireAuth accept the request.
// (Isira's shared request helper will replace this once it lands — until
// then every service needs to do this itself.)
function authHeaders() {
  const token = localStorage.getItem("worksy_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Get all tasks for a board
export const getTasks = async (boardId) => {
  const response = await fetch(`${API_BASE}/task/board/${boardId}`, {
    headers: authHeaders(),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch tasks");
  }

  return result.data;
};

// Get one task
export const getTask = async (taskId) => {
  const response = await fetch(`${API_BASE}/task/${taskId}`, {
    headers: authHeaders(),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch task");
  }

  return result.data;
};

// Create task
export const createTask = async (boardId, task) => {
  const response = await fetch(`${API_BASE}/task/board/${boardId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(task),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create task");
  }

  return result.data;
};

// Turns a 409 conflict response into an Error the caller can check
// with `error.conflict`, carrying the server's current copy of the task.
function throwIfConflict(response, result) {
  if (response.status === 409 || result.conflict) {
    const err = new Error(result.message || "This was changed by someone else — reload.");
    err.conflict = true;
    err.current = result.data;
    throw err;
  }
}

// Update task
export const updateTask = async (taskId, task) => {
  const response = await fetch(`${API_BASE}/task/${taskId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(task),
  });

  const result = await response.json();

  throwIfConflict(response, result);

  if (!response.ok) {
    throw new Error(result.message || "Failed to update task");
  }

  return result.data;
};

// Delete task
export const deleteTask = async (taskId) => {
  const response = await fetch(`${API_BASE}/task/${taskId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete task");
  }

  return result.data;
};

// Move task to another column. Pass the task's current `version` so the
// server can tell whether someone else changed it in the meantime.
export const moveTask = async (taskId, columnId, version) => {
  const response = await fetch(`${API_BASE}/task/${taskId}/move`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ columnId, version }),
  });

  const result = await response.json();

  throwIfConflict(response, result);

  if (!response.ok) {
    throw new Error(result.message || "Failed to move task");
  }

  return result.data;
};