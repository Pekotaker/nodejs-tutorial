var express = require("express");

var router = express.Router()


router.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.info = req.flash("info");
    next();
})
router.use("/", require("./home"));
router.use("/admin", require("./admin"));
router.use("/teacher", require("./teacher"));
router.use("/student", require("./student"));
module.exports = router;