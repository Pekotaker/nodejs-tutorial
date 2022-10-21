var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var User = require("./models/student");

var msg = null;
var loginByID = true;
module.exports = function(){

    passport.use(User.createStrategy());
    // Turns a user object into an id
    passport.serializeUser(function(user, done) {
        return done(null, user._id);
    }); // serializing the user
    passport.deserializeUser(function(id,done){
        User.findById(id, function(err, user) {
            return done(err, user);
        })
    }); // deserializing ther user

    
    passport.use("register", new LocalStrategy({
        usernameField: 'studentID',
        passwordField: 'password'
    }, function (studentID, password, done) {
        User.findOne({ studentID: studentID }, function (err, user) {
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
    passport.use("login", new LocalStrategy({
        usernameField: 'studentID',
        passwordField: 'password'
    }, function (studentID, password, done) {
        User.findOne({ studentID: studentID }, function (err, user) {
            if (err) { return done(err); }
            
            // ID not found
            if (!user) {
                loginByID = false;
                
                // Log in with email address
                LocalStrategy({
                    usernameField: 'email',
                    passwordField: 'password'
                },
                        User.findOne({email:studentID}, function(err, user) {
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
    passport.use("edit", new LocalStrategy({
        usernameField: 'studentID',
        passwordField: 'password'
    }, function (studentID, password, done) {
        User.findOne({ studentID: studentID }, function (err, user) {
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