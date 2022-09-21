const User = require("../models/user");
const { body, validationResult } = require("express-validator");

exports.userCreatePost = [
  body("first-name", "First name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("username", "Email must not be empty")
    .trim()
    .isLength({ min: 2 })
    .escape(),
  body("last-name", "Last name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "Password must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("confirm-password", "Must not be empty and must match password")
    .trim()
    .custom((value, { req }) => value === req.body.password)
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
  },
];

// get log in form
exports.userLogInGet = (req, res, next) => {
  res.render("logIn");
};

// handle log-in post
exports.userLogInPost = [
  body("username", "email must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "password must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  passport.authenticate("local", {
    // send to index while testing auth. Replace routes when done testing auth
    successRedirect: "/",
    failureRedirect: "/",
  }),
];
