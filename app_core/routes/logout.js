var express = require('express');
var router = express.Router();
var passport = require('passport');
const app = require('../app');

router.delete('/', (req, res) => {
    req.logOut();
    res.redirect('/login');
});

module.exports = router;