const Post = require("../models/post");
const User = require("../models/user");
const async = require("async");
const { body, validationResult } = require("express-validator");

exports.postHomeGet = (req, res, next) => {
  if (req.user) {
    async.parallel(
      {
        user(callback) {
          User.findOne({ username: req.user.username }).exec(callback);
        },
        posts(callback) {
          Post.find().populate("user").exec(callback);
        },
      },
      (err, results) => {
        if (err) {
          return next(err);
        }
        res.render("posts", {
          user: results.user,
          posts: results.post,
        });
      }
    );
  } else {
    res.redirect("/");
  }
};

exports.postHomePost = [
  body("post", "post must not be empty").trim().isLength({ min: 1 }).escape(),
  body("title", "title must not be empty").trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    async.parallel(
      {
        user(callback) {
          User.findById(req.body.user).exec(callback);
        },
        posts(callback) {
          Post.find().exec(callback);
        },
      },
      (err, results) => {
        const errors = validationResult(req);
        if (err) return next();
        const post = new Post({
          user: results.user._id,
          title: req.body.title,
          date: new Date(),
          content: req.body.post,
        });
        if (!errors.isEmpty()) {
          res.render("posts", {
            user: results.user,
            posts: results.posts,
          });
        }
        post.save((err) => {
          if (err) return next();
        });
      }
    );
  },
];
