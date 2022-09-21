var express = require("express");
var router = express.Router();
const userController = require('../controllers/userController');

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// get log-in form
router.get("/log-in", userController.userLogInGet);

module.exports = router;
