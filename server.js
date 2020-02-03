const express = require("express");
const mongoose = require("mongoose");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const post = require("./routes/api/post");

var app = express();

//Db config

const db = require("./config/keys").mongoURI;

//connect to mongo db
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("data base connected!!"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello world");
});

//use routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/post", post);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server running in port ${port}`);
});
