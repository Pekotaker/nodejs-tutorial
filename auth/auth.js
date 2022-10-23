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
    if (req.user.accountType == "teacher") {
        next();
    } else {
        req.flash("info", "You are not logged in as a teacher");
        res.redirect("/teacher/login");
    }
}

var ensureStudent = function ensureAuthenticated(req, res, next) {
    if (req.user.accountType == "student") {
        next();
    } else {
        req.flash("info", "You are not logged in as a student");
        res.redirect("/student/login");
    }
}
var ensureAdmin = function ensureAuthenticated(req, res, next) {
    if (req.user.accountType == "admin") {
        next();
    } else {
        req.flash("info", "You are not logged in as an admin");
        console.log(req.user);
        res.redirect("/admin/login");
    }
}

module.exports = {ensureAuthenticated: {ensureAuth, ensureTeacher, ensureStudent, ensureAdmin}};