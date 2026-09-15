// backend/src/socket.js
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let io = null;

/*
 * Sets up the real-time layer. Called once from server.js, after the
 * HTTP server is created and before it starts listening.
 *
 * Rooms: each board gets its own room ("board:<id>"). A client only
 * receives events for the board it has explicitly joined, so people
 * looking at Board A never get noise from Board B.
 */
function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  // Same rule as the HTTP middleware: no valid token, no connection.
  // Runs once when the socket is first opened.
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Not logged in."));
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = payload.sub;
      next();
    } catch (err) {
      next(new Error("Session expired or invalid. Please log in again."));
    }
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id} (user ${socket.userId})`);

    socket.on("board:join", (boardId) => {
      if (!boardId) return;
      socket.join(`board:${boardId}`);
    });

    socket.on("board:leave", (boardId) => {
      if (!boardId) return;
      socket.leave(`board:${boardId}`);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io has not been initialized yet.");
  }
  return io;
}

/*
 * Broadcast an event to everyone currently looking at a board.
 * Safe to call even if a boardId is missing/invalid — it just no-ops.
 */
function emitToBoard(boardId, event, payload) {
  if (!io || !boardId) return;
  io.to(`board:${boardId}`).emit(event, payload);
}

module.exports = { initSocket, getIO, emitToBoard };