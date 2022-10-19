// External modules, use 'npm install <module-name> --save'
var express = require("express");
var path = require("path");
var mongoose = require("mongoose");
var bodyparser = require("body-parser");
var cookieParser = require("cookie-parser");
var passport = require("passport");
var session = require("express-session");
var flash = require("connect-flash");

// Custom-made modules
var param = require("./params/params")
var setUpPassport = require("./setuppassport");
const setuppassport = require("./setuppassport");

// Custom Port
const Port = 55000;

// Connect to the database that store user's account infomation
var app = express();
mongoose.connect(param.DATABASECONNECTION);
setuppassport();

app.set("port", process.env.PORT || Port); // localhost:Port, use the 'express' module
app.set("views", path.join(__dirname, "views")); // Join path, use the 'path' module
app.set("view engine", "ejs"); // load the ejs (Embedded JavaScript templates) views files, use the 'ejs' module
app.use(bodyparser.urlencoded({extended:false})); // To access the information in the body of a POST request
app.use(cookieParser());
app.use(session({
    secret:"NMCNPM_ramdomBullshitHere",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.use("/", require("./routes/web"));
app.use("/api", require("./routes/api"));

// Start the server
app.listen(app.get("port"), function() {
    console.log("Server started on port " + app.get("port"));
});

