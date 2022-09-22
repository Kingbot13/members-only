var express = require("express");
var router = express.Router();
const userController = require("../controllers/userController");
const postController = require("../controllers/postController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// handle user sign up
router.post("/", userController.userCreatePost);

// get log-in form
router.get("/log-in", userController.userLogInGet);

// log-in post
router.post("/log-in", userController.userLogInPost);

// get member passcode page
router.get("/member-passcode", userController.memberPassGet);

// post member passcode page
router.post("/member-passcode", userController.memberPassPost);

// get posts page
router.get("/posts", postController.postHomeGet);

// handle posts post
router.post("/posts", postController.postHomePost);

module.exports = router;
