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
          posts: results.posts,
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
    const errors = validationResult(req);
    const post = new Post({
      user: req.user.id,
      title: req.body.title,
      date: new Date(),
      content: req.body.post,
    });

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
        if (err) {
          return next(err);
        }

        if (!errors.isEmpty()) {
          res.render("posts", {
            user: results.user,
            posts: results.posts,
            post,
          });
        }
        post.save((err) => {
          if (err) {
            return next(err);
          }
          res.redirect("/posts");
        });
      }
    );
  },
];

// get delete post form
exports.deletePostGet = (req, res, next) => {
  if (req.user) {
    Post.findById(req.params.id).exec((err, post) => {
      if (err) {
        return next(err);
      }
      res.render("deletePost", {
        post: post,
      });
    });
  } else {
    res.redirect("/");
  }
};

// handle post delete
exports.deletePostPost = (req, res, next) => {
  if (req.user) {
    User.findOne({ username: req.user.username }).exec((err, user) => {
      if (err) {
        return next(err);
      }
      if (user.membership && user.admin) {
        Post.findByIdAndRemove(req.params.id, (err) => {
          if (err) {
            return next(err);
          }
          res.redirect("/posts");
        });
      } else {
        res.redirect("/posts");
      }
    });
  } else {
    res.redirect("/");
  }
};
