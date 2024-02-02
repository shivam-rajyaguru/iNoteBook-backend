const mongoConnect = require("./db");
var cors = require("cors");

mongoConnect();
const express = require("express");
const User = require("./models/user");
const app = express();
const port = process.env.PORT || 3000;

//inbuilt middleware
app.use(express.json());
app.use(cors());

const UserRoute = require("./routes/auth");
const NoteRoute = require("./routes/notes");

app.use("/api/auth", UserRoute);
app.use("/api/notes", NoteRoute);

app.listen(port, () => {
  console.log(`Listning on port no:${port}`);
});
