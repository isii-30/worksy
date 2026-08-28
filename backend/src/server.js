const app = require("./app");

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`SyncBoard backend running on http://localhost:${PORT}`);
});