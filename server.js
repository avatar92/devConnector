const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const post = require("./routes/api/post");

var app = express();

//body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//Db config

const db = require("./config/keys").mongoURI;

//connect to mongo db
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log("data base connected!!"))
  .catch(err => console.log(err));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//passport config
require("./config/passport")(passport);

//use routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/post", post);

//Serve statics assets if in production final step to upload to heroku
if (process.env.NODE_ENV === "production") {
  //Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server running in port ${port}`);
});
