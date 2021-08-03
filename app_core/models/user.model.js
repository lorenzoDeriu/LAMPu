/**
 * https://www.bezkoder.com/node-js-rest-api-express-mysql/
 */

const db = require('./db');

// Constructor
const User = function(user) { 
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
    this.name = user.name;
    this.subscription = user.subscription;
};

User.create = (newUser, result) => {
    db.query("INSERT INTO USERS SET ?", newUser, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("user created successfully");
        result(null, newUser);
    });
};

User.findById = (username, result) => {
    db.query(`SELECT * FROM USERS WHERE Username = "${username}"`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log("user found");
            result(null, res[0]);
            return;
        }
        console.log("user not found");
        result({ kind: "not_found" }, null);
    });
};


User.findByEmail = (email, result) => {
    db.query(`SELECT * FROM USERS WHERE Email = "${email}"`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log("user found");
            result(null, res[0]);
            return;
        }
        console.log("user not found");
        result({ kind: "not_found" }, null);
    });
};

User.getAll = (result) => {
    db.query("SELECT * FROM USERS", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log(`${res.length} users`);
            result(null, res);
            return;
        }
        console.log("no users in the database");
        result({ kind: "not_found" }, null);
    });
};

User.updateById = (username, user, result) => {
    db.query("UPDATE USERS SET Password = ?, Email = ?, Name = ?, Username = ? WHERE Username = ?", 
        [user.password, user.email, user.name, user.username, username], 
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            if (res.affectedRows == 0) {
                // no user with that username
                result({ kind: "not_found" }, null);
                return;
            }
            console.log(`user ${username} updated`);
            result(null, user);
        });
};

User.removeById = (username, result) => {
    db.query("DELETE FROM USERS WHERE Username = ?",
        username,
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            if (res.affectedRows == 0) {
                // no user with that username
                console.log("user not found");
                result({ kind: "not_found" }, null);
                return;
            }
            console.log(`user ${username} deleted`);
            result(null, res);
        });
};

User.getToReadList = (username, result) => {
    console.log('retrieving to read list for user ' + username);
    db.query("SELECT ISBN FROM TO_READ WHERE Username = ?",
        username,
        (err, res) => {
            if (err) {
                console.log("error: " + err);
                result(err, null);
                return;
            }
            if (res.length === 0) {
                console.log(`user ${username}'s to read list is empty`);
                result({ kind: "empty_list" }, null);
                return;
            }
            console.log(`user ${username}'s to read list retrieved`);
            result(null, res);
        });
};

User.getReadBooksList = (username, result) => {
    console.log('retrieving read books list for user ' + username);
    db.query("SELECT ISBN FROM READ_BOOKS WHERE Username = ?",
        username,
        (err, res) => {
            if (err) {
                console.log("error: " + err);
                result(err, null);
                return;
            }
            if (res.length === 0) {
                console.log(`user ${username}'s read books list is empty`);
                result({ kind: "empty_list" }, null);
                return;
            }
            console.log(`user ${username}'s read books list retrieved`);
            result(null, res);
        });
};

User.addBookToReadByIsbn = (username, isbn, result) => {
    console.log(`username: ${username}, isbn: ${isbn}`);
    db.query("INSERT INTO TO_READ(ISBN, Username) VALUES(?,?)",
        [isbn, username],
        (err, res) => {
            if (err) {
                console.log("error: " + err);
                result(err, null);
                return;
            }
            console.log(`book ${isbn} added to ${username}'s to read list`);
            result(null, res);
        });
};

User.addReadBookByIsbn = (username, isbn, result) => {
    db.query("INSERT INTO READ_BOOKS(ISBN, Username) VALUES(?,?)",
    [isbn, username],
    (err, res) => {
        if (err) {
            console.log("error: " + err);
            result(err, null);
            return;
        }
        console.log(`book ${isbn} added to ${username}'s read books list`);
        result(null, res);
    });
};

module.exports = User;