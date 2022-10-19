var express = require("express");
var passport = require("passport");
var ensureAuthenticated = require("../../auth/auth").ensureAuthenticated;

var User = require("../../models/user");

var router = express.Router();

router.get("/", function(req, res) {
    res.render("home/index", {title: "home"});
}); 
router.get("/about", function(req, res) {
    res.render("home/about", {title: "about"});
}); 
router.get("/profile", ensureAuthenticated, function(req, res) {
    res.render("home/profile", {title: "profile"});
});

router.get("/login", function(req, res) {
    res.render("accounts/login", {title: "login"});
}); 

router.get("/logout", function(req,res, next) {
    req.logout(function(err) {
        if (err) {return next(err);}
        res.redirect("/");
    });
});

router.post("/login", passport.authenticate("login", {
    successRedirect:"/",
    failureRedirect:"/login",
    failureFlash:true
}));

router.get("/signup", function(req, res) {
    res.render("accounts/signup", {title: "signup"});
}); 

router.post("/signup", function(req, res, next) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({username:username}, function(err, user) {
        if (err) {return next(err);}
        if (user) {
            req.flash("error", "Username's already existed");
            return res.redirect("/signup");
        }

        User.findOne({email:email}, function(err, user) {
            if (err) {return next(err);}
            if (user) {
                req.flash("error", "There's already an account with this email");
                return res.redirect("/signup");
            }
    
            var newUser = new User({
                username:username,
                password:password,
                email:email
            });
    
            newUser.save(next);
    
        });

    });
    
    
}, passport.authenticate("login", {
    successRedirect:"/",
    failureRedirect:"/signup",
    failureFlash:true
}));


module.exports = router;