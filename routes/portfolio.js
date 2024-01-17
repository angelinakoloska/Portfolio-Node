var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
var request = require('request');
var bodyParser = require('body-parser');
const { param } = require('jquery');
var jsonParser = bodyParser.json();

/* GET home page. */
router.get('/', function(req, res, next) {
  let data = fs.readFileSync(path.resolve(__dirname, "../data/portfolio.json"));
  res.render('portfolio', { cakes: JSON.parse(data)});
});

//download image to the server:
var download = function(url, filename, callback){
  request.head(url, function(err, res, body){
    request(url).pipe(fs.createWriteStream(path.resolve(__dirname, '../data/img/'+ filename))).on('close', callback);
  });
};

router.post('/', jsonParser, function(req, res, next) {
  const expectedAttr = ['url', 'name', 'alt', 'category', 'header', 'description'];
  Object.keys(req.body).forEach(param => {
    if (!(expectedAttr.includes(param))) {
      res.status(400).end('Wrong Attr');
    } else {
      if (req.body[param] == '') {
        res.status(400).end(param + ' must have a value');
      }
    }
  });
  if (req.body.url == null || req.body.name == null) {
    res.status(400).end("Url/name not provided");
  }

  if (req.body.category != null) {
    if (!['wedding', 'christmas', 'birthday', 'anniversary'].includes(req.body.category)) {
      res.status(400).end("Wrong category provided");
    }
  }

  let rawdata = fs.readFileSync(path.resolve(__dirname, "../data/portfolio.json"));
  let portfoliosArray = JSON.parse(rawdata);
  if(portfoliosArray.filter(x => x.name === req.body.name).length == 0) {
    download(req.body.url, req.body.name, function(){
      console.log('done');
    });
    const newArray = portfoliosArray.concat([req.body])
    fs.writeFileSync(path.resolve(__dirname, "../data/portfolio.json"), JSON.stringify(newArray));
  }
  res.end();
});

router.delete('/', jsonParser, function(req, res, next) {
  let rawdata = fs.readFileSync(path.resolve(__dirname, "../data/portfolio.json"));
  let portfoliosArray = JSON.parse(rawdata);
  const newArray = portfoliosArray.filter(x => x.name !== req.body.name);
  if(newArray.length !== portfoliosArray.length) {
    fs.unlink(path.resolve(__dirname, '../data/img/' + req.body.name), () => {
      console.log(req.body.name + 'deleted!');
    })
    fs.writeFileSync(path.resolve(__dirname, "../data/portfolio.json"), JSON.stringify(newArray));
  }
  res.end();
});

module.exports = router;