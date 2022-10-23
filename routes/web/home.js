const { render } = require("ejs");
var express = require("express");
var passport = require("passport");
var ensureAuthenticated = require("../../auth/auth").ensureAuthenticated;


var router = express.Router();

router.get("/", function(req, res) {
    res.render("home/index", {title: "home"});
}); 
router.get("/about", function(req, res) {
    res.render("home/about", {title: "about"});
}); 

module.exports = router;