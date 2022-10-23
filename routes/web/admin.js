const { render } = require("ejs");
var express = require("express");
var passport = require("passport");
var ensureAuthenticated = require("../../auth/auth").ensureAuthenticated;
var admin = require("../../models/admin");
var router = express.Router();

router.get("/", function(req, res) {
    res.render("home/admin/index", {title: "home"});
}); 
router.get("/about", function(req, res) {
    res.render("home/admin/about", {title: "about"});
}); 

router.get("/profile", ensureAuthenticated.ensureAdmin, function(req, res) {
    res.render("accounts/admin/profile", {title: "profile"});
});


router.get("/login", function(req, res) {
    res.render("accounts/admin/login", {title: "login"});
}); 

router.get("/logout", function(req,res, next) {
    req.logout(function(err) {
        if (err) {return next(err);}
        res.redirect("/admin");
    });
});

router.post("/login", passport.authenticate("adminlogin", {
    successRedirect:"/admin",
    failureRedirect:"/admin/login",
    failureFlash:true,
    successFlash:true
}));

router.get("/register", function(req, res) {
    res.render("accounts/admin/register", {title: "register"});
}); 

router.post("/register", function(req, res, next) {
    var adminID = req.body.adminID;
    var email = req.body.email;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var birthday = req.body.birthday;
    var gender = req.body.gender;
    var phoneNumber = req.body.phoneNumber;
    var password = req.body.password;
    var repassword = req.body.repassword;
    
    if (!adminID) {
        req.flash("error", "Please fill in an ID");
        return res.redirect("/admin/register");
    }
    if (!email) {
        req.flash("error", "Please fill in an email");
        return res.redirect("/admin/register");
    }
    if (!firstname || !lastname) {
        req.flash("error", "Please fill in your full name");
        return res.redirect("/admin/register");
    }
    if(!birthday) {
        req.flash("error", "Please fill in your birthday");
        return res.redirect("/admin/register");
    }
    if (!phoneNumber ) {
        req.flash("error", "Please fill in a phone number");
        return res.redirect("/admin/register");
    }
    if (!password) {
        req.flash("error", "Please fill in a password");
        return res.redirect("/admin/register");
    }
    if (password != repassword) {
        req.flash("error", "Password does not match");
        return res.redirect("/admin/register")
    }

    admin.findOne({adminID:adminID}, function(err, user) {
        if (err) {return next(err);}
        if (user) {
            req.flash("error", "ID's already existed");
            return res.redirect("/admin/register");
        }

        admin.findOne({email:email}, function(err, user) {
            if (err) {return next(err);}
            if (user) {
                req.flash("error", "There's already an account with this email");
                return res.redirect("/admin/register");
            }

            admin.findOne({phoneNumber:phoneNumber}, function(err, user) {
                if (err) {return next(err);}
                if (user) {
                    req.flash("error", "There's already an account with this phone number");
                    return res.redirect("/admin/register");
                }
                var newUser = new admin({
                    username:adminID,
                    adminID:adminID,
                    password:password,
                    email:email,
                    fullname:{
                        firstname:firstname,
                        lastname:lastname
                    },
                    birthday:birthday,
                    gender:gender,
                    phoneNumber:phoneNumber
            })
    

            newUser.save(next);
            });
    
    
        });

    });
    
    
}, passport.authenticate("adminregister", {
    successRedirect:"/admin",
    failureRedirect:"/admin/register",
    failureFlash:true,
    successFlash:true
}));

router.get("/edit", ensureAuthenticated.ensureAdmin, function(req, res) {
    res.render("accounts/admin/edit", {title: "edit"});
});

router.post("/edit", ensureAuthenticated.ensureAdmin, function(req, res, next) {
    admin.findById(req.user.id, function(err, user) {
        if(!user) {
            req.flash("error", "Teacher not found");
            return res.redirect("/admin/edit");
        }
        req.body.adminID = user.adminID;
        var emailEdit = req.body.email.trim();
        var phoneNumberEdit = req.body.phoneNumber.trim();
        var password = req.body.password;
        if (!emailEdit) {
            req.flash("error", "Email name cannot be empty");
            return res.redirect('/admin/edit');
        }
        if (!phoneNumberEdit) {
            req.flash("error", "Phone Number cannot be empty");
            return res.redirect('/admin/edit');
        }
        if (!password) {
            req.flash("error" , "Invalid password");
            return res.redirect("/admin/edit");
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
                    return res.redirect("/admin/edit");
                }
            });
        }  
        req.flash("info", "Change saved successfully");    
    });
    

}, passport.authenticate("adminedit", {
    successRedirect:"/admin/profile",
    failureRedirect:"/admin/edit",
    failureFlash:true,
    successFlash:true
}));

module.exports = router;