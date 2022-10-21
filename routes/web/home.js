const { render } = require("ejs");
var express = require("express");
var passport = require("passport");
var ensureAuthenticated = require("../../auth/auth").ensureAuthenticated;

var User = require("../../models/student");

var router = express.Router();

router.get("/", function(req, res) {
    res.render("home/index", {title: "home"});
}); 
router.get("/about", function(req, res) {
    res.render("home/about", {title: "about"});
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
    failureFlash:true,
    successFlash:true
}));

router.get("/register", function(req, res) {
    res.render("accounts/register", {title: "register"});
}); 

router.post("/register", function(req, res, next) {
    var studentID = req.body.studentID;
    var email = req.body.email;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var birthday = req.body.birthday;
    var gender = req.body.gender;
    var phoneNumber = req.body.phoneNumber;
    var password = req.body.password;
    var repassword = req.body.repassword;
    
    if (!studentID) {
        req.flash("error", "Please fill in an ID");
        return res.redirect("/register");
    }
    if (!email) {
        req.flash("error", "Please fill in an email");
        return res.redirect("/register");
    }
    if (!firstname || !lastname) {
        req.flash("error", "Please fill in your full name");
        return res.redirect("/register");
    }
    if(!birthday) {
        req.flash("error", "Please fill in your birthday");
        return res.redirect("/register");
    }
    if (!phoneNumber ) {
        req.flash("error", "Please fill in a phone number");
        return res.redirect("/register");
    }
    if (!password) {
        req.flash("error", "Please fill in a password");
        return res.redirect("/register");
    }
    if (password != repassword) {
        req.flash("error", "Password does not match");
        return res.redirect("/register")
    }

    User.findOne({studentID:studentID}, function(err, user) {
        if (err) {return next(err);}
        if (user) {
            req.flash("error", "ID's already existed");
            return res.redirect("/register");
        }

        User.findOne({email:email}, function(err, user) {
            if (err) {return next(err);}
            if (user) {
                req.flash("error", "There's already an account with this email");
                return res.redirect("/register");
            }
    
            var newUser = new User({
                studentID:studentID,
                password:password,
                email:email,
                fullname:{
                    firstname:firstname,
                    lastname:lastname
                },
                birthday:birthday,
                gender:gender,
                phoneNumber:phoneNumber
            });
    
            newUser.save(next);
    
        });

    });
    
    
}, passport.authenticate("register", {
    successRedirect:"/",
    failureRedirect:"/register",
    failureFlash:true,
    successFlash:true
}));

router.get("/edit", ensureAuthenticated, function(req, res) {
    res.render("accounts/edit", {title: "edit"});
});

router.post("/edit", ensureAuthenticated, function(req, res, next) {
    User.findById(req.user.id, function(err, user) {
        if(!user) {
            req.flash("error", "Student not found");
            return res.redirect("/edit");
        }
        req.body.studentID = user.studentID;
        var emailEdit = req.body.email.trim();
        var phoneNumberEdit = req.body.phoneNumber.trim();
        var password = req.body.password;
        if (!emailEdit) {
            req.flash("error", "Email name cannot be empty");
            return res.redirect('/edit');
        }
        if (!phoneNumberEdit) {
            req.flash("error", "Phone Number cannot be empty");
            return res.redirect('/edit');
        }
        if (!password) {
            req.flash("error" , "Invalid password");
            return res.redirect("/edit");
        } else {
            user.checkPassword(password, function (err, isMatch) {
                if (err) {  return done(err); }
                if (isMatch) {
                    user.email = emailEdit;
                    user.phoneNumber = phoneNumberEdit;
                    user.save(function(err) {
                        if (!err) {
                            req.flash("error", "Edit profile failed");
                            return next(err);
                        }
                    });
                } else {
                    req.flash("error" , "Invalid password");
                    return res.redirect("/edit");
                }
            });
        }  
        req.flash("info", "Change saved successfully");    
    });
    

}, passport.authenticate("edit", {
    successRedirect:"/profile",
    failureRedirect:"/edit",
    failureFlash:true,
    successFlash:true
}));

module.exports = router;