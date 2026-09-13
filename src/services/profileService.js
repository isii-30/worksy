const API_BASE = "http://localhost:5000/api";
const SERVER_ORIGIN = API_BASE.replace(/\/api$/, "");

function authHeaders() {
  const token = localStorage.getItem('worksy_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getProfile() {
  const res = await fetch(`${API_BASE}/profile`, {
    headers: authHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to load profile.");
  return json.data;
}

export async function updateProfile(updates) {
  const res = await fetch(`${API_BASE}/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(updates),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to update profile.");
  return json.data;
}

export async function uploadProfilePicture(file) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_BASE}/profile/picture`, {
    method: "POST",
    headers: authHeaders(), // no Content-Type — browser sets the multipart boundary itself
    body: formData,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to upload photo.");
  return json.data;
}

export async function removeProfilePicture() {
  const res = await fetch(`${API_BASE}/profile/picture`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to remove photo.");
  return json.data;
}

export function resolveProfileImageUrl(profileImage) {
  if (!profileImage) return null;
  if (profileImage.startsWith("http")) return profileImage;
  return `${SERVER_ORIGIN}${profileImage}`;
}