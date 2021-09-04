var express = require('express');
var router = express.Router();
var passport = require('passport');
var users = require('../controllers/user.controller');

router.get('/', checkAuthenticated, users.readList);

//router.post('/add', users.addBookToRead);

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;
