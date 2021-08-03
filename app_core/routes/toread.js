var express = require('express');
var router = express.Router();
var passport = require('passport');
var users = require('../controllers/user.controller');

/* 
router.get('/', checkAuthenticated, function (req, res, next) {
    console.log(req.user);
    res.render('toread', { name: req.user.name });
});*/

router.get('/', checkAuthenticated, users.toReadList);

router.post('/add', users.addBookToRead);

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;
