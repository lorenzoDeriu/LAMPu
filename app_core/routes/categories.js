var express = require('express');
var router = express.Router();

/* GET categories home page. */
router.get('/', function(req, res, next) {
    /*retrieve all categories and send the list*/
    res.send('<h1>To-Do</h1>');
});

/* GET specific category page. */
router.get('/:category', function(req, res, next) {
    /*retrieve books from google books filtered by category*/
    let category = req.params.category;
    res.send(`<h1>Category: ${category}</h1>`);
    /* *** */

  });

module.exports = router;
