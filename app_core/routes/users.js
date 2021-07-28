var express = require('express');
var router = express.Router();
var users = require('../controllers/user.controller');

/* Create a new user. */
router.post('/', users.create); // da trasferire in register.js

/* GET all users (DEBUG) */
router.get('/', users.findAll);

/* GET a user by username */
router.get('/:username', users.findOne);

/* UPDATE user by username */
router.put('/:username', users.update);

/* DELETE user by username */
router.delete('/:username', users.delete);


module.exports = router;
