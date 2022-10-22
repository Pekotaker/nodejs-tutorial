var express = require("express");
var ensureAuthenticated = require("../../auth/auth").ensureAuthenticated;
var router = express.Router();

router.use(ensureAuthenticated.ensureAuth);

router.get("/", function(req, res) {
    res.render("accounts/profile", {title: "profile"});
});

module.exports = router;