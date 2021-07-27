var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

/* GET register user page. */
router.get('/', function(req, res, next) {
  res.render('register', { title: 'Register' });
});
var users = [];

/* POST register user */
router.post('/', async function(req, res, next) {
    /* get users from file users.json --- temp solution */
    var fs = require('fs');
    fs.readFile('./users.json', (err, data) => {
        if (err) throw err;
        users = JSON.parse(data);
        console.log(JSON.stringify(users));
    });
    
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
        });
        res.redirect('/login');
    } catch {
        res.redirect('/register');
    }
    
    fs.writeFile('./users.json', JSON.stringify(users), (err) => {
        if (err) throw err;
        console.log('users updated!');
    });
});

module.exports = router;
