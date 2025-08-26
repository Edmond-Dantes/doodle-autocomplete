const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "/")));

// Fallback for 404
app.use((req, res) => {
  res.status(404).send("404 - Not Found");
});

app.listen(PORT, () => {
  console.log(`Static server running at http://localhost:${PORT}`);
});