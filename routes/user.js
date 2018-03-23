var express = require("express"),
router = express.Router({mergeParams: true}),
mongoose = require("mongoose"),
User = require("../models/user");

router.get("/:username", function(req, res) {
  User.findByUsername(req.user.username, function(err, user) {
    if(err) {
      console.log(err);
    } else {
      if(req.user.username === req.params.username) {
        res.render("user/show", {user: user});
      } else {
        res.redirect("/logout");
      }
    }
  });
});

router.put("/:username", function(req, res) {
  User.findByIdAndUpdate(req.user.id, req.body.user, function(err, user) {
    if(err) {
      console.log(err);
    } else {
      res.redirect("/user/" + req.body.user.username);
    }
  });
});

router.put("/:username/pass", function(req, res) {
  User.findByUsername(req.params.username, function(err, user) {
    if(req.body.newPassword === req.body.confNewPass) {
      user.changePassword(req.body.curPassword, req.body.newPassword, function(err) {
        if(err) {
          console.log(err);
          res.redirect("/user/" + req.params.username);
        }
        res.redirect("/user/" + req.params.username);
      });
    } else {
      res.redirect("/user/" + req.params.username);
    }
  });
});

module.exports = router;
