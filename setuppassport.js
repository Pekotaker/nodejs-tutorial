var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var User = require("./models/user");

var msg = null;
var loginByUsername = true;
module.exports = function(){

    passport.use(User.createStrategy());
    // Turns a user object into an id
    passport.serializeUser(User.serializeUser()); // serializing the user
    passport.deserializeUser(User.deserializeUser()); // deserializing ther user
    passport.use("login", new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, function (username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            
            if (!user) {
                loginByUsername = false;
                
                LocalStrategy({
                    usernameField: 'email',
                    passwordField: 'password'
                },
                        User.findOne({email:username}, function(err, user) {
                            if (err) {return done(err);}                          
                            if (!user) {
                                msg = "Username or email not found";
                                return done(null, false, {message: msg});
                            } else {

                                user.checkPassword(password, function (err, isMatch) {
                                    if (err) {  return done(err); }
                                    if (isMatch) {
                                        return done(null, user);
                                    } else {
                                        msg = "Invalid password";
                                        return done(null, false, { message: msg });
                                    }
                                });
                            }
                        })
                );
            };
            if (loginByUsername == true) {
                user.checkPassword(password, function (err, isMatch) {
                    if (err) { return done(err); }
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        msg = "Invalid password";
                        return done(null, false, { message: msg });
                    }
                });
            } else {

            }
        });
    }));
}