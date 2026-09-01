require("dotenv").config();
const app = require("./app");
const { connectDb } = require("./config/db");

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDb();               // connect to MongoDB first
  app.listen(PORT, () => {         // only then start accepting requests
    console.log(`SyncBoard backend running on http://localhost:${PORT}`);
  });
}

startServer();