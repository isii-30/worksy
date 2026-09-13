import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

let socket = null;
let currentBoardId = null;

// Connects once. If a page re-mounts and asks for a socket that's
// already open, it just reuses it instead of reconnecting.
function connect() {
  if (socket) {
    return socket;
  }

  const token = localStorage.getItem("worksy_token");

  socket = io(SOCKET_URL, {
    auth: { token },
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection failed:", err.message);
  });

  return socket;
}

// Joins a board's room, leaving the previous one first so a user
// switching boards doesn't keep receiving updates for the old board.
function joinBoard(boardId) {
  const s = connect();

  if (currentBoardId && currentBoardId !== boardId) {
    s.emit("board:leave", currentBoardId);
  }

  currentBoardId = boardId;
  s.emit("board:join", boardId);
}

function leaveBoard(boardId) {
  if (!socket) return;

  socket.emit("board:leave", boardId);

  if (currentBoardId === boardId) {
    currentBoardId = null;
  }
}

function on(event, handler) {
  connect().on(event, handler);
}

function off(event, handler) {
  if (!socket) return;
  socket.off(event, handler);
}

function disconnect() {
  if (!socket) return;
  socket.disconnect();
  socket = null;
  currentBoardId = null;
}

const socketService = {
  connect,
  joinBoard,
  leaveBoard,
  on,
  off,
  disconnect,
};

export default socketService;