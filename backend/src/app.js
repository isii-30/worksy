const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const loadRoutes = require("./utils/routeLoader");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (req, res) => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  const dbState = states[mongoose.connection.readyState] || "unknown";

  res.json({
    success: true,
    message: "SyncBoard API is running",
    database: dbState,
  });
});

// Automatically load module routes
loadRoutes(app);

module.exports = app;