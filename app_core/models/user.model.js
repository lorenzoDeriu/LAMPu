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
    this.surname = user.surname;
    this.date = user.date;
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
    db.query(`SELECT * FROM USERS WHERE Username = ${username}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log("user found: ", res[0]);
            result(null, res[0]);
            return;
        }
        console.log("user not found");
        result({ kind: "not_found" }, null);
    });
};


User.findByEmail = (email, result) => {
    db.query(`SELECT * FROM USERS WHERE Email = ${email}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log("user found: ", res[0]);
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
            console.log(`${res.length} users: `, res);
            result(null, res);
            return;
        }
        console.log("no users in the database");
        result({ kind: "not_found" }, null);
    });
};

User.updateById = (username, user, result) => {
    db.query("UPDATE USERS SET Password = ?, Email = ?, Name = ?, Surname = ?, Username = ? WHERE Username = ?", 
        [user.password, user.email, user.name, user.surname, user.username, username], 
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


module.exports = User;