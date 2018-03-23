var express = require("express"),
router = express.Router(),
passport = require("passport"),
nodemailer = require("nodemailer"),
User = require("../models/user");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.TRANSPORTERUSER,
    pass: process.env.TRANSPORTERPASS
  }
});

//LANDING PAGE
router.get("/", function(req, res) {
    res.render("landing");
});


//DISPLAY REGISTRATION FORM
router.get("/register", function(req, res) {
    res.render("register");
});

//HANDLE REGISTRATION
router.post('/register', function(req, res) {
    var newUser = User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
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

//DISPLAY CONTACT PAGE
router.get("/contact", function(req, res) {
  res.render("contact");
});

//SEND CONTACT FORM MESSAGE TO AARON@CORDERCODING.COM
router.post("/contact", function(req, res) {
  //create message based on form input
  var message = {
    priority: "high",
    to: "aaron@cordercoding.com",
    subject: req.body.subject,
    text: "Contact Form Submission From: " + req.body.email + "\r\nFirst Name: " + req.body.firstName + "\r\nLast Name: " + req.body.lastName + "\r\n" + req.body.message
  }
  //send message using nodemailer
  transporter.sendMail(message, function(err, inf){
    if(err) {
      console.log(err);
    } else {
      res.redirect("/contact");
    }
  })
});

module.exports = router;
