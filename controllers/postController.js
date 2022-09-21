const Post = require("../models/post");
const User = require("../models/user");
const async = require("async");

exports.postHomeGet = (req, res, next) => {
  if (req.user) {
    async.parallel(
      {
        user(callback) {
          User.findOne({ username: req.user.username }).exec(callback);
        },
        posts(callback) {
          Post.find().exec(callback);
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
