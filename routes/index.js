var express = require("express"),
router = express.Router(),
passport = require("passport"),
User = require("../models/user");

//LANDING PAGE
router.get("/", function(req, res) {
    res.render("landing");
});


//DISPLAY REGISTRATION FORM
router.get("/register", function(req, res) {
    res.render("register");
});

//HANDLE REGISTRATION
router.post("/register", function(req, res) {
    var newUser = User({ username: req.body.user.username });
    User.register(newUser, req.body.user.password, function(err, user) {
        if(err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/blog");
            });
        }
    });
});

//DISPLAY LOGIN FORM
router.get("/login", function(req, res) {
    res.render("login");
});

//HANDLE LOGIN
router.post("/login", passport.authenticate("local", {
        successRedirect: "/blog",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: "Logged In"
    }), function(req, res){
});

//HANDLE LOGOUT
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/login");
});

//DISPLAY ABOUT PAGE
router.get("/about", function(req, res) {
    res.render("about");
});

//DISPLAY PORTFOLIO
router.get("/portfolio", function(req, res) {
    res.render("portfolio");
});

module.exports = router;