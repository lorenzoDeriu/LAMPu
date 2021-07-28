var express = require('express');
var router = express.Router();

/* GET user login page. */
router.get('/', function (req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/', function (req, res, next) {
  res.send('POST request');
});

module.exports = router;
