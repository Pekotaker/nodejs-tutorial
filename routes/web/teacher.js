const { render } = require("ejs");
var express = require("express");
var passport = require("passport");
var ensureAuthenticated = require("../../auth/auth").ensureAuthenticated;
var teacher = require("../../models/teacher");
var router = express.Router();

router.get("/", function(req, res) {
    res.render("home/index", {title: "teacherhome"});
}); 
router.get("/about", function(req, res) {
    res.render("home/about", {title: "teacherabout"});
}); 

router.get("/profile", ensureAuthenticated.ensureTeacher, function(req, res) {
    res.render("accounts/teacher/profile", {title: "teacherprofile"});
});


router.get("/login", function(req, res) {
    res.render("accounts/teacher/login", {title: "teacherlogin"});
}); 

router.get("/logout", function(req,res, next) {
    req.logout(function(err) {
        if (err) {return next(err);}
        res.redirect("/teacher");
    });
});

router.post("/login", passport.authenticate("teacherlogin", {
    successRedirect:"/teacher",
    failureRedirect:"/teacher/login",
    failureFlash:true,
    successFlash:true
}));

router.get("/register", function(req, res) {
    res.render("accounts/teacher/register", {title: "teacherregister"});
}); 

router.post("/register", function(req, res, next) {
    var teacherID = req.body.teacherID;
    var email = req.body.email;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var birthday = req.body.birthday;
    var gender = req.body.gender;
    var phoneNumber = req.body.phoneNumber;
    var password = req.body.password;
    var repassword = req.body.repassword;
    
    if (!teacherID) {
        req.flash("error", "Please fill in an ID");
        return res.redirect("/teacher/register");
    }
    if (!email) {
        req.flash("error", "Please fill in an email");
        return res.redirect("/teacher/register");
    }
    if (!firstname || !lastname) {
        req.flash("error", "Please fill in your full name");
        return res.redirect("/teacher/register");
    }
    if(!birthday) {
        req.flash("error", "Please fill in your birthday");
        return res.redirect("/teacher/register");
    }
    if (!phoneNumber ) {
        req.flash("error", "Please fill in a phone number");
        return res.redirect("/teacher/register");
    }
    if (!password) {
        req.flash("error", "Please fill in a password");
        return res.redirect("/teacher/register");
    }
    if (password != repassword) {
        req.flash("error", "Password does not match");
        return res.redirect("/teacher/register")
    }

    teacher.findOne({teacherID:teacherID}, function(err, user) {
        if (err) {return next(err);}
        if (user) {
            req.flash("error", "ID's already existed");
            return res.redirect("/teacher/register");
        }

        teacher.findOne({email:email}, function(err, user) {
            if (err) {return next(err);}
            if (user) {
                req.flash("error", "There's already an account with this email");
                return res.redirect("/teacher/register");
            }

            teacher.findOne({phoneNumber:phoneNumber}, function(err, user) {
                if (err) {return next(err);}
                if (user) {
                    req.flash("error", "There's already an account with this phone number");
                    return res.redirect("/teacher/register");
                }
                var newUser = new teacher({
                    username:teacherID,
                    teacherID:teacherID,
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
    
    
}, passport.authenticate("teacherregister", {
    successRedirect:"/teacher",
    failureRedirect:"/teacher/register",
    failureFlash:true,
    successFlash:true
}));

router.get("/edit", ensureAuthenticated.ensureTeacher, function(req, res) {
    res.render("accounts/teacher/edit", {title: "teacheredit"});
});

router.post("/edit", ensureAuthenticated.ensureTeacher, function(req, res, next) {
    teacher.findById(req.user.id, function(err, user) {
        if(!user) {
            req.flash("error", "Teacher not found");
            return res.redirect("/teacher/edit");
        }
        req.body.teacherID = user.teacherID;
        var emailEdit = req.body.email.trim();
        var phoneNumberEdit = req.body.phoneNumber.trim();
        var password = req.body.password;
        if (!emailEdit) {
            req.flash("error", "Email name cannot be empty");
            return res.redirect('/teacher/edit');
        }
        if (!phoneNumberEdit) {
            req.flash("error", "Phone Number cannot be empty");
            return res.redirect('/teacher/edit');
        }
        if (!password) {
            req.flash("error" , "Invalid password");
            return res.redirect("/teacher/edit");
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
                    return res.redirect("/teacher/edit");
                }
            });
        }  
        req.flash("info", "Change saved successfully");    
    });
    

}, passport.authenticate("teacheredit", {
    successRedirect:"/teacher/profile",
    failureRedirect:"/teacher/edit",
    failureFlash:true,
    successFlash:true
}));

module.exports = router;