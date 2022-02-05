var express = require("express");
var router = express.Router();

let words = [];

router.get("/", function (req, res, next) {
  res.send(words);
});

router.post("/", function (req, res) {
  try {
    words.push(req.body);
  } catch (err) {
    res.send(err);
  }
});
module.exports = router;
