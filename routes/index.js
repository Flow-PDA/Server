var express = require('express');
var router = express.Router();

var usersRouter = require('./users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({msg: "Hello"})
});

router.use('/users', usersRouter);

module.exports = router;
