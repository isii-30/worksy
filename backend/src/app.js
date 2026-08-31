const express = require("express");
const cors = require("cors");

const loadRoutes = require("./utils/routeLoader");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "SyncBoard API is running",
  });
});

// Automatically load module routes
loadRoutes(app);

module.exports = app;