const calendarService = require("./calendar.service");

const getEvents = (req, res) => {
  const events = calendarService.getAllEvents();

  res.status(200).json({
    success: true,
    data: events
  });
};

const getEventsByDate = (req, res) => {
  const { date } = req.params;

  const events = calendarService.getEventsByDate(date);

  res.status(200).json({
    success: true,
    data: events
  });
};

const createEvent = (req, res) => {
  const eventData = req.body;

  const newEvent = calendarService.createEvent(eventData);

  res.status(201).json({
    success: true,
    data: newEvent
  });
};

const updateEvent = (req, res) => {
  const { eventId } = req.params;
  const eventData = req.body;

  const updatedEvent = calendarService.updateEvent(
    eventId,
    eventData
  );

  if (!updatedEvent) {
    return res.status(404).json({
      success: false,
      message: "Calendar event not found"
    });
  }

  res.status(200).json({
    success: true,
    data: updatedEvent
  });
};

const deleteEvent = (req, res) => {
  const { eventId } = req.params;

  const deletedEvent = calendarService.deleteEvent(eventId);

  if (!deletedEvent) {
    return res.status(404).json({
      success: false,
      message: "Calendar event not found"
    });
  }

  res.status(200).json({
    success: true,
    data: deletedEvent
  });
};

module.exports = {
  getEvents,
  getEventsByDate,
  createEvent,
  updateEvent,
  deleteEvent
};