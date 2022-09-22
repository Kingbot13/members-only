const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.userCreatePost = [
  body("firstName", "First name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("username", "Email must not be empty")
    .trim()
    .isLength({ min: 2 })
    .escape(),
  body("lastName", "Last name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "Password must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("confirmPassword", "Must not be empty and must match password")
    .trim()
    .custom((value, { req }) => value === req.body.password)
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    bcrypt.hash(req.body.password, 8, (err, hash) => {
      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        membership: false,
        password: hash,
      });
      if (!errors.isEmpty()) {
        res.render("index", { user });
      }
      if (err) {
        return next(err);
      }
      user.save((err) => {
        if (err) return next(err);
        res.redirect("/");
      });
    });
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
    successRedirect: "/member-passcode",
    failureRedirect: "/log-in",
  }),
];

// get member pass page
exports.memberPassGet = (req, res, next) => {
  if (req.user) {
    res.render("memberPass");
  } else {
    res.redirect("/");
  }
};

// handle member pass post
exports.memberPassPost = [
  body("passcode", "passcode must not be empty")
    .trim()
    .isLength({ min: 1 })
    .custom((value) => value === "potato")
    .withMessage("wrong, try again!")
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) res.render("memberPass");
    User.findOneAndUpdate(
      { username: req.user.username },
      { membership: true },
      (err, theUser) => {
        if (err) next(err);
        res.redirect("/posts");
      }
    );
  },
];
