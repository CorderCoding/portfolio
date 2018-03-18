var express = require("express"),
router = express.Router(),
User = require("../models/user"),
Comment = require("../models/comment"),
Post = require("../models/post");

//DISPLAY BLOG INDEX
router.get("/", function(req, res) {
  Post.find({}, function(err, posts) {
    if(err) {
      console.log(err);
    } else {
      res.render("blog/index", {posts: posts});
    }
  });
});

//DSIPLAY NEW POST FORM
router.get("/new", function(req, res) {
  if((req.user && req.user.isAuthor) || (req.user && req.user.isAdmin)) {
    res.render("blog/new");
  } else {
    res.redirect("/login");
  }
});

//CREATE NEW POST
router.post("/", function(req, res) {
  User.findById(req.user._id, function(err, user) {
    if(err) {
      console.log(err);
    } else {
      if((req.user && req.user.isAuthor) || (req.user && req.user.isAdmin)) {
        Post.create(req.body.post, function(err, post) {
          if(err) {
            console.log(err);
          } else {
            post.author.id = req.user._id;
            post.author.username = req.user.username
            post.save();
            user.posts.push(post.id);
            user.save();
            res.redirect("/blog");
          }
        });
      }
    }
  });
});

//SHOW POST
router.get("/:post_id", function(req, res) {
  Post.findById(req.params.post_id).populate("comments").exec(function(err, post) {
    if(err) {
      console.log(err);
    } else {
      res.render("blog/show", {post: post});
    }
  });
});

//DISPLAY EDIT POST FORM
router.get("/edit/:post_id", function(req, res) {
  Post.findById(req.params.post_id, function(err, post) {
    if(err) {
      console.log(err);
    } else {
      res.render("blog/edit", {post: post});
    }
  });
});

//UPDATE POST
router.put("/edit/:post_id", function(req, res) {
  Post.findByIdAndUpdate(req.params.post_id,{$set:{"title":req.body.post.title, "body":req.body.post.body}}, function(err, post) {
    if(err) {
      console.log(err);
    } else {
      res.redirect("/blog/" + req.params.post_id);
    }
  });
});

//DESTROY POST
router.delete("/delete/:post_id", function(req, res) {
  Post.findByIdAndRemove(req.params.post_id).populate("comments").exec(function(err, post) {
    if(err) {
      console.log(err);
    } else {
      post.comments.forEach(function(comment) {
        User.findByIdAndUpdate(comment.author.id, {$pull:{"comments":comment.id}}, function(err) {
          if(err) {
            console.log(err);
          }
        })
      });
      User.findByIdAndUpdate(post.author.id, {$pull:{"posts": req.params.post_id}}, function(err, user) {
        if(err) {
          console.log(err);
        } else {
          res.redirect("/blog");
        } 
      });
    }
  });
})

module.exports = router;