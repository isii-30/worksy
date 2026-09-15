require("dotenv").config();
const http = require("http");
const app = require("./app");
const { connectDb } = require("./config/db");
const { initSocket } = require("./socket");

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDb();                 // connect to MongoDB first

  // Wrap the Express app in a plain HTTP server so Socket.io can
  // attach to the same port instead of needing one of its own.
  const server = http.createServer(app);
  initSocket(server);

  server.listen(PORT, () => {        // only then start accepting requests
    console.log(`SyncBoard backend running on http://localhost:${PORT}`);
  });
}

startServer();