var express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
var ensureLoggedIn = ensureLogIn();

/* GET home page. */
router.get("/", function (req, res, next) {
  let data = fs.readFileSync(
    path.resolve(__dirname, "../data/recommendations.json")
  );
  res.render("recommendations", { data: JSON.parse(data) });
});

router.post("/", jsonParser, function (req, res, next) {
  let rawdata = fs.readFileSync(
    path.resolve(__dirname, "../data/recommendations.json")
  );
  let recommendationsArray = JSON.parse(rawdata);
  if (
    recommendationsArray.filter((x) => x.name === req.body.name).length == 0
  ) {
    const newArray = recommendationsArray.concat([req.body]);
    fs.writeFileSync(
      path.resolve(__dirname, "../data/recommendations.json"),
      JSON.stringify(newArray)
    );
  }
  res.end();
});

router.delete("/", jsonParser, ensureLoggedIn, function (req, res, next) {
  let rawdata = fs.readFileSync(
    path.resolve(__dirname, "../data/recommendations.json")
  );
  let recommendationsArray = JSON.parse(rawdata);
  const newArray = recommendationsArray.filter((x) => x.name !== req.body.name);
  if (newArray.length !== recommendationsArray.length) {
    fs.writeFileSync(
      path.resolve(__dirname, "../data/recommendations.json"),
      JSON.stringify(newArray)
    );
  }
  res.end();
});

module.exports = router;