// middleware to check user type

var ensureAuth = function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash("info", "You are not logged in");
        res.redirect("/login");
    }
}

var ensureTeacher = function ensureAuthenticated(req, res, next) {
    if (req.body.accountType == "teacher") {
        next();
    } else {
        req.flash("info", "You are not a teacher");
        res.redirect("/teacher/login");
    }
}

module.exports = {ensureAuthenticated: {ensureAuth, ensureTeacher}};