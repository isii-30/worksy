const API_BASE = "http://localhost:5000/api";

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Login failed.");
  return json.data;
}

export async function register(firstName, lastName, email, password) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstName, lastName, email, password }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Registration failed.");
  return json.data;
}

export async function logout() {
  const res = await fetch(`${API_BASE}/auth/logout`, { method: "POST" });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Logout failed.");
  return json;
}