var express = require("express"),
router = express.Router({mergeParams: true}),
Post = require("../models/post"),
User = require("../models/user"),
Comment = require("../models/comment");

//ADD COMMENT
router.post("/", function(req, res) {
  User.findById(req.user.id, function(err, user) {
    if(err) {
      console.log(err);
    } else {
      Post.findById(req.params.post_id, function(err, post) {
        if(err) {
          console.log(err);
        } else {
          var sanitized = req.sanitize(req.body.comment);
          Comment.create({body: sanitized}, function(err, comment) {
            if(err) {
              console.log(err);
            } else {
              comment.author.id = req.user.id;
              comment.author.username = req.user.username;
              comment.save();
              post.comments.push(comment.id);
              post.save();
              user.comments.push(comment.id);
              user.save();
              res.redirect("/blog/" + req.params.post_id);
            }
          });
        }
      });
    }
  });
});

//EDIT COMMENT
router.get("/:comment_id/edit", function(req, res) {
  Post.findById(req.params.post_id, function(err, post) {
    if(err) {
      console.log(err);
    } else {
      console.log(post);
      Comment.findById(req.params.comment_id, function(err, comment) {
        if(err) {
          console.log(err);
        } else {
          res.render("comment/edit", {post: post, comment: comment});
        }
      });
    } 
  });
});

//UPDATE COMMENT
router.put("/:comment_id", function(req, res) {
  var sanitized = req.sanitize(req.body.comment);
  Comment.findByIdAndUpdate(req.params.comment_id, {$set: {"body":sanitized}}, function(err, comment) {
    if(err) {
      console.log(err);
    } else{
      res.redirect("/blog/" + req.params.post_id);
    }
  });
});

//DESTROY COMMENT
router.delete("/:comment_id/delete", function(req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function(err, comment) {
    if(err) {
      console.log(err);
    } else {
      Post.findByIdAndUpdate(req.params.post_id, {$pull:{"comments":req.params.comment_id}}, function(err, post) {
        if(err) {
          console.log(err);
        } else {
          User.findByIdAndUpdate(comment.author.id, {$pull:{"comments":req.params.comment_id}}, function(err, user) {
            if(err) {
              console.log(err);
            } else {
              res.redirect("/blog/" + req.params.post_id);
            }
          });
        }
      });
    }
  });
});
module.exports = router;