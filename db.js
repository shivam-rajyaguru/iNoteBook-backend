const mongoose = require("mongoose");

const mongoURI = "mongodb://127.0.0.1:27017/iNoteBook";

const mongoConnect = () => {
  mongoose
    .connect(mongoURI)
    .then(() => {
      console.log("Database connected succefully");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = mongoConnect;
