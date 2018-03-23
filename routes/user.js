var express = require("express"),
router = express.Router({mergeParams: true}),
mongoose = require("mongoose"),
passport = require("passport"),
User = require("../models/user");

router.get("/:user_id", function(req, res) {
  User.findById(req.params.user_id).populate("posts comments").exec(function(err, user) {
    if(err) {
      console.log(err);
    } else {
      res.render("user/show", {user: user});
    }
  });
});

router.put("/:user_id", function(req, res) {
  User.findByIdAndUpdate(req.params.user_id, req.body.user,  function(err) {
    if(err) {
      console.log(err);
    } else {
      res.redirect("/user/" + req.params.user_id);
    }
  });
});

router.put("/:user_id/pass", function(req, res) {
  User.findByUsername(req.params.user_id, function(err, user) {
    if(req.body.newPassword === req.body.confNewPass) {
      user.changePassword(req.body.curPassword, req.body.newPassword, function(err) {
        if(err) {
          console.log(err);
          res.redirect("/user/" + req.params.user_id);
        }
        res.redirect("/user/" + req.params.user_id);
      });
    } else {
      res.redirect("/user/" + req.params.user_id);
    }
  });
});

module.exports = router;
