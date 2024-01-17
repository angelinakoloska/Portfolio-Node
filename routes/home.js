var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()  

/* GET home page. */
router.get('/', function(req, res, next) {
  let data = fs.readFileSync(path.resolve(__dirname, '../data/introductionArray.json'));
  res.render('home', { array: JSON.parse(data) });
});

router.post('/', function(req, res, next) {
  let rawdata = fs.readFileSync(path.resolve(__dirname, '../data/introductionArray.json'));
  let array = JSON.parse(rawdata);
  const newArray = array.concat([req.body.newText])
  fs.writeFileSync(path.resolve(__dirname, '../data/introductionArray.json'), JSON.stringify(newArray));
})

router.delete('/', function(req, res, next) {
  const itemToRemove = req.body.deletedText;
  let rawdata = fs.readFileSync(path.resolve(__dirname, '../data/introductionArray.json'));
  let array = JSON.parse(rawdata);
  const index = array.indexOf(itemToRemove);
  
  if (index !== -1) {
    array.splice(index, 1);
    fs.writeFileSync(path.resolve(__dirname, '../data/introductionArray.json'), JSON.stringify(array));
  }

})

module.exports = router;