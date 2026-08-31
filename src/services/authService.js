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

export async function changePassword(currentPassword, newPassword) {
  const res = await fetch(`${API_BASE}/auth/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to change password.");
  return json.data;
}

export async function resetPassword(email, newPassword) {
  const res = await fetch(`${API_BASE}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, newPassword }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to reset password.");
  return json.data;
}