const express = require("express");
const session = require("express-session");
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const morgan = require('morgan');
const app = express();
const passport = require("passport");
const flash = require("express-flash");
require("dotenv").config();
require('./config/passport')(passport); // pass passport for configuration



//--------------------------------------
app.use("/public", express.static("public"));

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view-engine", "ejs");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// load our routes and pass in our app and fully configured passport
require('./app/routes.js')(app, passport); 

app.listen("3000", () => {
  console.log("server started at 3000");
});
