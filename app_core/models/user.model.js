/**
 * https://www.bezkoder.com/node-js-rest-api-express-mysql/
 */

const db = require('./db');
const googleBooks = require('./book.models');

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

    db.query(`SELECT B.ISBN, title, publisher, publishedDate, language
        FROM BOOKS B, TO_READ TR WHERE username = ? AND B.ISBN = TR.ISBN`,
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
            
            var list = [];
            /*var isbn = null;
            var currentBook = null;
            for (row of res) {
                if (row.ISBN !== isbn) {
                    if (currentBook !== null)
                        list.push(currentBook);
                    isbn = row.ISBN;
                    currentBook = {
                        isbn: isbn,
                        title: row.title,
                        authors: [row.author],
                        publisher: row.publisher,
                        publishedDate: row.publishedDate,
                        categories: [row.category],
                        thumbnail: null,
                        language: row.language
                    };
                } else {
                    if (!currentBook.authors.includes(row.author))
                        currentBook.authors.push(row.author);
                    if (!currentBook.categories.includes(row.category))
                        currentBook.categories.push(row.category);
                }
            }*/
            for (row of res) {
                list.push({
                    isbn: row.ISBN,
                    title: row.title,
                    publisher: row.publisher,
                    publishedDate: row.publishedDate,
                    language: row.language
                });
            }
            result(null, list);
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
    var t0 = performance.now();
    googleBooks.foundByISBN(isbn).then( ({err, data}) => {
        if (err) {
            console.log('error google books: ' + err.message);
            result(err, null);
            return;
        } else {
            //insert book in books
            console.log(data);
            console.log(data[0].isbn);
            let book = data[0];
            db.query(`INSERT INTO BOOKS(ISBN, title, publisher, publishedDate, language)
                VALUES(?, ?, ?, ?, ?)`,
                [book.isbn[0].identifier, book.title, book.publisher, book.publishedDate, book.language],
                (err, res) => {
                    if (err) {
                        console.log("error: " + err);
                        result(err, null);
                        return;
                    }
                    //insert isbn and username in to_read
                    db.query("INSERT INTO TO_READ(ISBN, Username) VALUES(?,?)",
                        [isbn, username],
                        (err, res) => {
                            if (err) {
                                console.log("error: " + err);
                                result(err, null);
                                return;
                            }
                            //insert authors
                            if (book.authors) {
                                for (author of book.authors) {
                                    db.query("INSERT INTO AUTHORS(ISBN, author) VALUES(?,?)",
                                    [isbn, author],
                                    (err, res) => {
                                        if (err) {
                                            console.log("error: " + err);
                                            result(err, null);
                                            return;
                                        }
                                    });
                                }
                            }
                            
                            //insert categories
                            if (book.categories) {
                                for (category of book.categories) {
                                    db.query("INSERT INTO CATEGORIES(ISBN, category) VALUES(?,?)",
                                    [isbn, category],
                                    (err, res) => {
                                        if (err) {
                                            console.log("error: " + err);
                                            result(err, null);
                                            return;
                                        }
                                    });
                                }
                            }
                            return;
                            //insert thumbnails
                        });
                    console.log(`book isbn: ${isbn} added to ${username}'s to read list.`);
                    return;
                });
            return;
        }
    });

    var t1 = performance.now();
    console.log('execution time: ' + (t1-t0) + 'milliseconds');
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