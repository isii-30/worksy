const API_BASE = "http://localhost:5000/api";

export async function getProfile() {
  const res = await fetch(`${API_BASE}/profile`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to load profile.");
  return json.data;
}

export async function updateProfile(updates) {
  const res = await fetch(`${API_BASE}/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to update profile.");
  return json.data;
}