var express = require("express"),
router = express.Router({mergeParams: true}),
nodemailer = require("nodemailer"),
Post = require("../models/post"),
User = require("../models/user"),
Comment = require("../models/comment");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.TRANSPORTERUSER,
    pass: process.env.TRANSPORTERPASS
  }
});

//ADD COMMENT
router.post("/", function(req, res) {
  //if logged in, find user in DB
  User.findById(req.user.id, function(err, user) {
    if(err) {
      console.log(err);
    } else {
      //find post in DB
      Post.findById(req.params.post_id, function(err, post) {
        if(err) {
          console.log(err);
        } else {
          //sanitize comment of any <script>s
          var sanitized = req.sanitize(req.body.comment);
          //create sanitized comment
          Comment.create({body: sanitized}, function(err, comment) {
            if(err) {
              console.log(err);
            } else {
              //add author information based on user
              comment.author.id = req.user.id;
              comment.author.username = req.user.username;
              comment.save();
              //push comment to posts comments array
              post.comments.push(comment.id);
              post.save();
              //push comment to users comments array
              user.comments.push(comment.id);
              user.save();
              var message = {
                priority: "high",
                to: "aaron@cordercoding.com",
                text: req.user.username + " has commented on your post. Here is what they said:\r\n" + req.body.comment + "\r\nClick below to visit the post.\r\nhttps://cordercoding.com/blog/" + req.params.post_id
              }
              transporter.sendMail(message, function(err, inf) {
                if(err) {
                  console.log(err);
                } else {
                  res.redirect("back");
                }
              });
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
