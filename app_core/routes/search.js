var express = require('express');
var router = express.Router();
var users = require('../controllers/user.controller');
var googleBooks = require('../controllers/book.controller');

/* 
router.get('/', checkAuthenticated, function (req, res, next) {
    console.log(req.user);
    res.render('toread', { name: req.user.name });
});*/

router.get('/', (req, res) => {
    res.redirect('/');
})

/* Generic search */
router.post('/', (req, res) => {
    googleBooks.search(req, res);
});

router.post('/add/toread', (req, res) => {
    users.addBookToRead(req, res);
});

router.post('/add/read');

//router.post('/add', users.addBookToRead);

module.exports = router;
