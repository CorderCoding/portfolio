var express = require("express"),
router = express.Router(),
User = require("../models/user"),
Post = require("../models/post");

//DISPLAY BLOG INDEX
router.get("/", function(req, res) {
    res.render("blog/index");
});

//DSIPLAY NEW POST FORM
router.get("/new", function(req, res) {
  res.render("blog/new");
});

//CREATE NEW POST
router.post("/", function(req, res) {
  User.findById(req.user.id, function(err, user) {
    if(err) {
      console.log(err);
    } else {
      Post.create(req.body.post, function(err, post) {
        if(err) {
          console.log(err);
        } else {
          post.author = req.user.id;
          post.save();
          user.posts.push(post.id);
          user.save();
          res.redirect("/blog");
        }
      });
    }
  });
});
//SHOW POST

//DISPLAY EDIT POST FORM

//UPDATE POST

//DESTROY POST

module.exports = router;