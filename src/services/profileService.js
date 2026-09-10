const API_BASE = "http://localhost:5000/api";
const SERVER_ORIGIN = API_BASE.replace(/\/api$/, "");

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

// Uploads the actual image file (not a base64 string) to the server, which
// stores it on disk and saves only the file's URL on the user document.
export async function uploadProfilePicture(file) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_BASE}/profile/picture`, {
    method: "POST",
    body: formData, // no Content-Type header — the browser sets the multipart boundary itself
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to upload photo.");
  return json.data;
}

export async function removeProfilePicture() {
  const res = await fetch(`${API_BASE}/profile/picture`, { method: "DELETE" });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to remove photo.");
  return json.data;
}

// profileImage is stored as a relative path like "/uploads/profile-pictures/xyz.jpg".
// This turns it into a full URL the <img> tag can actually load.
export function resolveProfileImageUrl(profileImage) {
  if (!profileImage) return null;
  if (profileImage.startsWith("http")) return profileImage; // already a full URL
  return `${SERVER_ORIGIN}${profileImage}`;
}