const API_URL = "http://localhost:5000/api/calendar";

export const getCalendarEvents = async () => {
  const response = await fetch(`${API_URL}/events`);

  if (!response.ok) {
    throw new Error("Failed to fetch calendar events");
  }

  const result = await response.json();

  return result.data;
};