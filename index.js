const mongoConnect = require("./db");

mongoConnect();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", () => {
  console.log("Hello world!");
});

app.listen(port, () => {
  console.log(`Listning on port no:${port}`);
});
