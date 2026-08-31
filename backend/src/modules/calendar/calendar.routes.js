const express = require("express");
const calendarController = require("./calendar.controller");

const router = express.Router();

router.get("/events", calendarController.getEvents);

router.get("/events/:date", calendarController.getEventsByDate);

router.post("/events", calendarController.createEvent);

router.put("/events/:eventId", calendarController.updateEvent);

router.delete("/events/:eventId", calendarController.deleteEvent);

module.exports = router;