var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render('index', { title: 'Express' });
  console.log("this is private!")
  res.status(200).json({});
});

module.exports = router;
