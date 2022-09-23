var express = require("express");
var router = express.Router();
const userController = require("../controllers/userController");
const postController = require("../controllers/postController");
const passport = require("passport");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// handle user sign up
router.post("/", userController.userCreatePost);

// get log-in form
router.get("/log-in", userController.userLogInGet);

// log-in post
router.post(
  "/log-in",
  passport.authenticate("local", {
    failureRedirect: "/log-in",
    failureMessage: true,
  }),
  function (req, res) {
    res.redirect("/member-passcode");
  }
);

// get member passcode page
router.get("/member-passcode", userController.memberPassGet);

// post member passcode page
router.post("/member-passcode", userController.memberPassPost);

// get admin passcode page
router.get("/admin-passcode", userController.adminPassGet);

// post admin passcode page
router.post("/admin-passcode", userController.adminPassPost);

// get posts page
router.get("/posts", postController.postHomeGet);

// handle posts post
router.post("/posts", postController.postHomePost);

// get message delete form
router.get("/posts/:id/delete", postController.deletePostGet);

// handle delete form post
router.post("/posts/:id/delete", postController.deletePostPost);

module.exports = router;
