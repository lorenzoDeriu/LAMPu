const mysql = require('mysql');
const dbConfig = require('../config/db.config');

// Create a connection
const connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});

// Open the connection
connection.connect( (err) => {
    if (err) throw err;
    console.log('Connected to MySql database.');
});

module.exports = connection;