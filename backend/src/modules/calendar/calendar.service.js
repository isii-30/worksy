const calendarEvents = require("../../data/mock/calendarEvents");

const getAllEvents = () => {
  return calendarEvents;
};

const getEventsByDate = (date) => {
  return calendarEvents.filter((event) => event.date === date);
};

const createEvent = (eventData) => {
  const newEvent = {
    id: `e${calendarEvents.length + 1}`,
    ...eventData
  };

  calendarEvents.push(newEvent);

  return newEvent;
};

const updateEvent = (eventId, eventData) => {
  const eventIndex = calendarEvents.findIndex(
    (event) => event.id === eventId
  );

  if (eventIndex === -1) {
    return null;
  }

  calendarEvents[eventIndex] = {
    ...calendarEvents[eventIndex],
    ...eventData
  };

  return calendarEvents[eventIndex];
};

const deleteEvent = (eventId) => {
  const eventIndex = calendarEvents.findIndex(
    (event) => event.id === eventId
  );

  if (eventIndex === -1) {
    return null;
  }

  const deletedEvent = calendarEvents.splice(eventIndex, 1);

  return deletedEvent[0];
};

module.exports = {
  getAllEvents,
  getEventsByDate,
  createEvent,
  updateEvent,
  deleteEvent
};