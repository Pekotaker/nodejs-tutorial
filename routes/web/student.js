const { render } = require("ejs");
var express = require("express");
var passport = require("passport");
var ensureAuthenticated = require("../../auth/auth").ensureAuthenticated;
var student = require("../../models/student");
var router = express.Router();

router.get("/", function(req, res) {
    res.render("home/student/index", {title: "home"});
}); 
router.get("/about", function(req, res) {
    res.render("home/student/about", {title: "about"});
}); 

router.get("/profile", ensureAuthenticated.ensureStudent, function(req, res) {
    res.render("accounts/student/profile", {title: "profile"});
});


router.get("/login", function(req, res) {
    res.render("accounts/student/login", {title: "login"});
}); 

router.get("/logout", function(req,res, next) {
    req.logout(function(err) {
        if (err) {return next(err);}
        res.redirect("/student");
    });
});

router.post("/login", passport.authenticate("studentlogin", {
    successRedirect:"/student",
    failureRedirect:"/student/login",
    failureFlash:true,
    successFlash:true
}));

router.get("/register", function(req, res) {
    res.render("accounts/student/register", {title: "register"});
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
        return res.redirect("/student/register");
    }
    if (!email) {
        req.flash("error", "Please fill in an email");
        return res.redirect("/student/register");
    }
    if (!firstname || !lastname) {
        req.flash("error", "Please fill in your full name");
        return res.redirect("/student/register");
    }
    if(!birthday) {
        req.flash("error", "Please fill in your birthday");
        return res.redirect("/student/register");
    }
    if (!phoneNumber ) {
        req.flash("error", "Please fill in a phone number");
        return res.redirect("/student/register");
    }
    if (!password) {
        req.flash("error", "Please fill in a password");
        return res.redirect("/student/register");
    }
    if (password != repassword) {
        req.flash("error", "Password does not match");
        return res.redirect("/student/register")
    }

    student.findOne({studentID:studentID}, function(err, user) {
        if (err) {return next(err);}
        if (user) {
            req.flash("error", "ID's already existed");
            return res.redirect("/student/register");
        }

        student.findOne({email:email}, function(err, user) {
            if (err) {return next(err);}
            if (user) {
                req.flash("error", "There's already an account with this email");
                return res.redirect("/student/register");
            }

            student.findOne({phoneNumber:phoneNumber}, function(err, user) {
                if (err) {return next(err);}
                if (user) {
                    req.flash("error", "There's already an account with this phone number");
                    return res.redirect("/student/register");
                }
                var newUser = new student({
                    username:studentID,
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
            })
    

            newUser.save(next);
            });
    
    
        });

    });
    
    
}, passport.authenticate("studentregister", {
    successRedirect:"/student",
    failureRedirect:"/student/register",
    failureFlash:true,
    successFlash:true
}));

router.get("/edit", ensureAuthenticated.ensureStudent, function(req, res) {
    res.render("accounts/student/edit", {title: "edit"});
});

router.post("/edit", ensureAuthenticated.ensureStudent, function(req, res, next) {
    student.findById(req.user.id, function(err, user) {
        if(!user) {
            req.flash("error", "student not found");
            return res.redirect("/student/edit");
        }
        req.body.studentID = user.studentID;
        var emailEdit = req.body.email.trim();
        var phoneNumberEdit = req.body.phoneNumber.trim();
        var password = req.body.password;
        if (!emailEdit) {
            req.flash("error", "Email name cannot be empty");
            return res.redirect('/student/edit');
        }
        if (!phoneNumberEdit) {
            req.flash("error", "Phone Number cannot be empty");
            return res.redirect('/student/edit');
        }
        if (!password) {
            req.flash("error" , "Invalid password");
            return res.redirect("/student/edit");
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
                    return res.redirect("/student/edit");
                }
            });
        }  
        req.flash("info", "Change saved successfully");    
    });
    

}, passport.authenticate("studentedit", {
    successRedirect:"/student/profile",
    failureRedirect:"/student/edit",
    failureFlash:true,
    successFlash:true
}));

module.exports = router;