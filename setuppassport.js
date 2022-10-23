var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var student = require("./models/student");
var teacher = require("./models/teacher");
var admin = require("./models/admin");

var msg = null;
var loginByID = true;
module.exports = function(){

    passport.use(admin.createStrategy(), student.createStrategy(), teacher.createStrategy());
    // Turns a user object into an id
    passport.serializeUser(function(user, done) {
        return done(null, user._id);
    }); // serializing the user
    passport.deserializeUser(function(id,done){
        student.findById(id, function(err, user) {
            if (user) return done(err, user);
        })
        teacher.findById(id, function(err, user) {
            if (user) return done(err, user);
        })
        admin.findById(id, function(err, user) {
            if (user) return done(err, user);
        })
    }); // deserializing ther user
    
    passport.use("adminregister", new LocalStrategy({
        usernameField: 'adminID',
        passwordField: 'password'
    }, function (adminID, password, done) {
        admin.findOne({ adminID: adminID }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: "Invalid ID" });
            }
            user.checkPassword(password, function (err, isMatch) {
                if (err) { return done(err); }
                if (isMatch) {
                    msg = "Logged in successfully";
                    return done(null, user, {message:msg});
                } else {
                    msg = "Invalid password";
                    return done(null, false, { message: msg });
                }
            });
    })}));
    
    // Login with ID
    passport.use("adminlogin", new LocalStrategy({
        usernameField: 'adminID',
        passwordField: 'password'
    }, function (adminID, password, done) {
        admin.findOne({ adminID: adminID }, function (err, user) {
            if (err) { return done(err); }
            
            // ID not found
            if (!user) {
                loginByID = false;
                
                // Log in with email address
                LocalStrategy({
                    usernameField: 'email',
                    passwordField: 'password'
                },
                        admin.findOne({email:adminID}, function(err, user) {
                            if (err) {return done(err);}   
                            
                            // Email not found
                            if (!user) {
                                msg = "ID or email not found";
                                return done(null, false, {message: msg});
                            } else { // Email address found

                                user.checkPassword(password, function (err, isMatch) {
                                    if (err) {  return done(err); }
                                    if (isMatch) {
                                        msg = "Logged in successfully";
                                        return done(null, user, {message:msg});
                                    } else {
                                        msg = "Invalid password";
                                        return done(null, false, { message: msg });
                                    }
                                });
                            }
                        })
                );
            };

            // ID found
            if (loginByID == true) {
                user.checkPassword(password, function (err, isMatch) {
                    if (err) { return done(err); }
                    if (isMatch) {
                        msg = "Logged in successfully";
                        return done(null, user, {message:msg});
                    } else {
                        msg = "Invalid password";
                        return done(null, false, { message: msg });
                    }
                });
            }
        });
    }));
    passport.use("adminedit", new LocalStrategy({
        usernameField: 'studentID',
        passwordField: 'password'
    }, function (adminID, password, done) {
        admin.findOne({ adminID: adminID }, function (err, user) {
            if (err) { return done(err); }

            user.checkPassword(password, function (err, isMatch) {
                if (err) { return done(err); }
                if (isMatch) {
                    msg = "Changed saved successfully"
                    return done(null, user, {message: msg});
                } else {
                    
                    msg = "Invalid password";
                    return done(null, false, { message: msg });
                }
            });
        });
    }));

    passport.use("studentregister", new LocalStrategy({
        usernameField: 'studentID',
        passwordField: 'password'
    }, function (studentID, password, done) {
        student.findOne({ studentID: studentID }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: "Invalid ID" });
            }
            user.checkPassword(password, function (err, isMatch) {
                if (err) { return done(err); }
                if (isMatch) {
                    msg = "Logged in successfully";
                    return done(null, user, {message:msg});
                } else {
                    msg = "Invalid password";
                    return done(null, false, { message: msg });
                }
            });
    })}));
    
    // Login with ID
    passport.use("studentlogin", new LocalStrategy({
        usernameField: 'studentID',
        passwordField: 'password'
    }, function (studentID, password, done) {
        student.findOne({ studentID: studentID }, function (err, user) {
            if (err) { return done(err); }
            
            // ID not found
            if (!user) {
                loginByID = false;
                
                // Log in with email address
                LocalStrategy({
                    usernameField: 'email',
                    passwordField: 'password'
                },
                        student.findOne({email:studentID}, function(err, user) {
                            if (err) {return done(err);}   
                            
                            // Email not found
                            if (!user) {
                                msg = "ID or email not found";
                                return done(null, false, {message: msg});
                            } else { // Email address found

                                user.checkPassword(password, function (err, isMatch) {
                                    if (err) {  return done(err); }
                                    if (isMatch) {
                                        msg = "Logged in successfully";
                                        return done(null, user, {message:msg});
                                    } else {
                                        msg = "Invalid password";
                                        return done(null, false, { message: msg });
                                    }
                                });
                            }
                        })
                );
            };

            // ID found
            if (loginByID == true) {
                user.checkPassword(password, function (err, isMatch) {
                    if (err) { return done(err); }
                    if (isMatch) {
                        msg = "Logged in successfully";
                        return done(null, user, {message:msg});
                    } else {
                        msg = "Invalid password";
                        return done(null, false, { message: msg });
                    }
                });
            }
        });
    }));
    passport.use("studentedit", new LocalStrategy({
        usernameField: 'studentID',
        passwordField: 'password'
    }, function (studentID, password, done) {
        student.findOne({ studentID: studentID }, function (err, user) {
            if (err) { return done(err); }

            user.checkPassword(password, function (err, isMatch) {
                if (err) { return done(err); }
                if (isMatch) {
                    msg = "Changed saved successfully"
                    return done(null, user, {message: msg});
                } else {
                    
                    msg = "Invalid password";
                    return done(null, false, { message: msg });
                }
            });
        });
    }));
    passport.use("teacherregister", new LocalStrategy({
        usernameField: 'teacherID',
        passwordField: 'password'
    }, function (teacherID, password, done) {
        teacher.findOne({ teacherID: teacherID }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: "Invalid ID" });
            }
            user.checkPassword(password, function (err, isMatch) {
                if (err) { return done(err); }
                if (isMatch) {
                    msg = "Logged in successfully";
                    return done(null, user, {message:msg});
                } else {
                    msg = "Invalid password";
                    return done(null, false, { message: msg });
                }
            });
    })}));
    
    // Login with ID
    passport.use("teacherlogin", new LocalStrategy({
        usernameField: 'teacherID',
        passwordField: 'password'
    }, function (teacherID, password, done) {
        teacher.findOne({ teacherID: teacherID }, function (err, user) {
            if (err) { return done(err); }
            
            // ID not found
            if (!user) {
                loginByID = false;
                
                // Log in with email address
                LocalStrategy({
                    usernameField: 'email',
                    passwordField: 'password'
                },
                        teacher.findOne({email:teacherID}, function(err, user) {
                            if (err) {return done(err);}   
                            
                            // Email not found
                            if (!user) {
                                msg = "ID or email not found";
                                return done(null, false, {message: msg});
                            } else { // Email address found

                                user.checkPassword(password, function (err, isMatch) {
                                    if (err) {  return done(err); }
                                    if (isMatch) {
                                        msg = "Logged in successfully";
                                        return done(null, user, {message:msg});
                                    } else {
                                        msg = "Invalid password";
                                        return done(null, false, { message: msg });
                                    }
                                });
                            }
                        })
                );
            };

            // ID found
            if (loginByID == true) {
                user.checkPassword(password, function (err, isMatch) {
                    if (err) { return done(err); }
                    if (isMatch) {
                        msg = "Logged in successfully";
                        return done(null, user, {message:msg});
                    } else {
                        msg = "Invalid password";
                        return done(null, false, { message: msg });
                    }
                });
            }
        });
    }));
    passport.use("teacheredit", new LocalStrategy({
        usernameField: 'teacherID',
        passwordField: 'password'
    }, function (teacherID, password, done) {
        teacher.findOne({ teacherID: teacherID }, function (err, user) {
            if (err) { return done(err); }

            user.checkPassword(password, function (err, isMatch) {
                if (err) { return done(err); }
                if (isMatch) {
                    msg = "Changed saved successfully"
                    return done(null, user, {message: msg});
                } else {
                    
                    msg = "Invalid password";
                    return done(null, false, { message: msg });
                }
            });
        });
    }));
}