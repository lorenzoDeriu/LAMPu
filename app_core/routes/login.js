var express = require('express');
var router = express.Router();
var passport = require('passport');
const app = require('../app');

/* GET user login page. */
router.get('/', checkNotAuthenticated, function (req, res, next) {
  res.render('login', { layout: false });
});

router.post('/', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
}

module.exports = router;
