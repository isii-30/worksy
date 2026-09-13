const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TOKEN_KEY = "worksy_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest(path, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  let json = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }

  if (res.status === 401) {
    clearToken();
    throw new Error(json?.message || "Please log in again.");
  }

  if (!res.ok) {
    throw new Error(json?.message || "Request failed.");
  }

  // Returns the whole response. Login and register need this, because the
  // backend sends the token beside data, not inside it.
  return json;
}

// Most endpoints only care about data. Login and register use apiRequest
// directly so they can also read the token.
export const api = {
  get: async (path) => (await apiRequest(path)).data,
  post: async (path, body) =>
    (await apiRequest(path, { method: "POST", body: JSON.stringify(body) })).data,
  put: async (path, body) =>
    (await apiRequest(path, { method: "PUT", body: JSON.stringify(body) })).data,
  patch: async (path, body) =>
    (await apiRequest(path, { method: "PATCH", body: JSON.stringify(body) })).data,
  delete: async (path) => (await apiRequest(path, { method: "DELETE" })).data,
};