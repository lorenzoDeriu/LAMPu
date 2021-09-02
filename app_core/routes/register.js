var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var users = require('../controllers/user.controller');

/* GET register user page. */
router.get('/', function(req, res, next) {
  res.render('register', { layout: false });
});

/* POST register user */
router.post('/', async function(req, res, next) {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;
        users.create(req, res);
    } catch (error) {
        console.log(error);
    }
});


module.exports = router;
