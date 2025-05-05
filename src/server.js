const express = require("express");
const router = require("./routes/editor");
const path = require("path");

const app = express();
app.use(express.static(path.join(__dirname, "../public")));
app.use("/api/editor", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
