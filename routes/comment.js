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
  var sanitized = req.sanitize(req.body.comment);
  Comment.create({body: sanitized}, function(err, comment){
    Post.findById(req.params.post_id, function(err, post) {
      if(err) {
        console.log(err);
      } else {
        comment.post.id = post.id;
        comment.post.title = post.title;
        comment.save();
        post.comments.push(comment.id);
        post.save();
      }
    });
    User.findById(req.user.id, function(err, user) {
      if(err) {
        console.log(err);
      } else {
        comment.author.id = user.id;
        if(!user.name) {
          comment.author.username = req.user.username;
        } else {
          comment.author.username = req.user.name;
        }
        comment.save();
        user.comments.push(comment.id);
        user.save();
      }
    });
  });
  Post.findById(req.params.post_id, function(err, post) {
    if(err) {
      console.log(err);
    } else {
      var sent = [];
      User.findById(post.author.id, function(err, user) {
        if(err) {
          console.log(err);
        } else {
          if(!user._id.equals(req.user.id)) {
            sent.push(user.email);
            if(req.user.name) {
              name = req.user.name;
            } else {
              name = req.user.username;
            }
            var message = {
              priority: "high",
              to: user.email,
              subject: "New Comment Added to Post",
              text: name + " has commented on your post. Here is what they said:\r\n\r\n" + req.body.comment + "\r\n\r\nClick below to visit the post.\r\n\r\nhttps://cordercoding.com/blog/" + req.params.post_id
            }
            transporter.sendMail(message, function(err, inf) {
              if(err) {
                console.log(err);
              }
              res.redirect("back");
            });
          }
        }
      });
      for(var i = 0; i < post.comments.length; i++) {
        Comment.findById(post.comments[i], function(err, comment) {
          if(err) {
            console.log(err);
          } else {
            User.findById(comment.author.id, function(err, user) {
              if(err) {
                console.log(err);
              } else {
                if(user.email && user.recvEmails && sent.indexOf(user.email) === -1 && !user._id.equals(req.user.id)) {
                  sent.push(user.email);
                  if(req.user.name) {
                    name = req.user.name;
                  } else {
                    name = req.user.username;
                  }
                  var message = {
                    priority: "high",
                    to: user.email,
                    subject: "New Comment Added to Post",
                    text: name + " has commented on a post you commented on. Here is what they said:\r\n\r\n" + req.body.comment + "\r\n\r\nClick below to visit the post.\r\n\r\nhttps://cordercoding.com/blog/" + req.params.post_id
                  }
                  transporter.sendMail(message, function(err, inf) {
                    if(err) {
                      console.log(err);
                    }
                    res.redirect("back");
                  });
                }
              }
            });
          }
        });
      }
    }
  });
});

//EDIT COMMENT
router.get("/:comment_id/edit", function(req, res) {
  Post.findById(req.params.post_id, function(err, post) {
    if(err) {
      console.log(err);
    } else {
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
