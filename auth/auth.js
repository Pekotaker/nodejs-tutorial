// middleware to check user type

var ensureAuth = function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash("info", "You are not logged in");
        res.redirect("/login");
    }
}

module.exports = {ensureAuthenticated: ensureAuth};