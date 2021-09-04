const Mongoose = require("mongoose");
const Book = require("../models/bookDB.model.js");
const User = require("../models/user.model.js");

// Create and Save a new user
exports.create = (req, res) => {
    
    if (!req.body) {
        console.log('Error: Content can not be empty!');
        res.status(400).render('error', {
            message: "Content can not be empty!"
        });
    }

    // Create the new user
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
    });
    console.log(user);
    
    User.findOne({ $or: [ { username: user.username }, { email: user.email } ] }, (err, result) => {
        if (err) {
            return (err, null);
        } else {
            if (result) {
                if (result.email === user.email) {
                    return res.render('register', {
                        layout: false,
                        message: 'E-mail already registered.'
                    });
                } else {
                    return res.render('register', {
                        layout: false,
                        message: 'Username already in use.'
                    });
                }
            } else {
                user.save( (err, user) => {
                    if (err) {
                        console.log(err);
                        res.render('error', {
                            error: err,
                            message: err.message
                        });
                    } else {
                        res.status(201).render('login', {
                            layout: false,
                            message: 'User registered successfully. Now you can login with the new account.'
                        });
                    }
                });
            }
        }
    });
};

// Find a single user with a username
/*exports.findOne = (req, res) => {
    User.findById(req.params.username, (err, data) => {
        if (err) {
          console.log('erroreeeeeeeee');
          if (err.kind === "not_found") {
            res.status(404).render('error', {
                error: err,
                message: `Not found user with username ${req.params.username}.`
            });
          } else {
            res.status(500).send({
                error: err,
                message: "Error retrieving user with username " + req.params.username
            });
          }
        } else res.send(data);
      });
};*/

// Update a user identified by the username in the request
exports.update = (req, res) => {
    if (!req.body) {
        res.status(400).render('error', {
            message: "Content can not be empty!"
        });
    }

    User.updateById(req.params.username,
        new User(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).render('error', {
                        error: err,
                        message: `Not found user with username ${req.params.username}.`
                    });
                } else {
                    res.status(500).render('error', {
                        error: err,
                        message: "Error updating user with username " + req.params.username
                    });
                }
            } else {
                res.send(data);
            }
        });
};

// Delete a user with the specified username in the request
exports.delete = (req, res) => {
    User.removeById(req.params.username, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).render('error', {
                    error: err,
                    message: `Not found user with username ${req.params.username}.`
                });
            } else {
                res.status(500).render('error', {
                    error: err,
                    message: "Could not delete user with username " + req.params.username
                });
            }
        } else {
            res.send({ message: `User deleted!`});
        }
    });
};

exports.toReadList = (req, res) => {
    User.findOne({ username: req.user.username }, async (err, user) => {
        if (err) {
            res.status(500).render('error', {
                error: err,
                message: err.message || "Some error occurred while retrieving the list."
            });
        } else if (!user.to_read_list || user.to_read_list.length === 0) {
            res.render('toread', {
                name: req.user.name,
                message: 'No books in the list'
            });
        } else {
            var toReadList = [];
            for await (let ISBN of user.to_read_list) {
                await Book.findOne({ 'isbn.identifier': ISBN }, (err, book) => {
                    if (err) {
                        console.log(err);
                    } else {
                        toReadList.push(book);
                    }
                });
            }
            return res.render('toread', { 
                name: req.user.name,
                list: JSON.stringify(toReadList)
            });
        }
    });
};

exports.readList = (req, res) => {
    User.findOne({ username: req.user.username }, async (err, user) => {
        if (err) {
            res.status(500).render('error', {
                error: err,
                message: err.message || "Some error occurred while retrieving the list."
            });
        } else if (!user.read_list || user.read_list.length === 0) {
            res.render('read', {
                name: req.user.name,
                message: 'No books in the list'
            });
        } else {
            var readList = [];
            for await (let ISBN of user.read_list) {
                await Book.findOne({ 'isbn.identifier': ISBN }, (err, book) => {
                    if (err) {
                        console.log(err);
                    } else {
                        readList.push(book);
                    }
                });
            }
            return res.render('read', { 
                name: req.user.name,
                list: JSON.stringify(readList)
            });
        }
    });
};

exports.addBookToRead = (req, res) => {
    if (!req.user?.username) {
        res.render('login', { 
            layout: false,
            message: 'You need to sign in first to add books to your lists.'
        });
    } else {
        let book = Book(JSON.parse(req.body.book));
        User.updateOne(
            { username: req.user.username },
            { $addToSet: { to_read_list: book.isbn[0]?.identifier || book.isbn[1]?.identifier} },
            (err, data) => {
            if (err) {
                res.status(500).render('error', {
                    error: err,
                    message: err.message || "Some error occurred while adding the book to the list."
                });
            } else {
                Book.findOneAndUpdate(
                    { isbn: book.isbn }, // query
                    book, // update
                    { upsert: true, useFindAndModify: false }, //options
                    (err, data) => {
                        if (err) {
                            res.status(500).render('error', {
                                error: err,
                                message: err.message || "Some error occurred while adding the book to the database."
                            });
                        } else {
                            res.send('book added');
                        }
                    }
                )
            }
        });
    }
}

exports.addBookRead = (req, res) => {
    if (!req.user?.username) {
        res.render('login', { 
            layout: false,
            message: 'You need to sign in first to add books to your lists.'
        });
    } else {
        let book = Book(JSON.parse(req.body.book));
        User.updateOne(
            { username: req.user.username },
            { $addToSet: { read_list: book.isbn[0]?.identifier || book.isbn[1]?.identifier} },
            (err, data) => {
            if (err) {
                res.status(500).render('error', {
                    error: err,
                    message: err.message || "Some error occurred while adding the book to the list."
                });
            } else {
                Book.findOneAndUpdate(
                    { isbn: book.isbn }, // query
                    book, // update
                    { upsert: true, useFindAndModify: false }, //options
                    (err, data) => {
                        if (err) {
                            res.status(500).render('error', {
                                error: err,
                                message: err.message || "Some error occurred while adding the book to the database."
                            });
                        } else {
                            res.send('book added');
                        }
                    }
                )
            }
        });
    }
}

/* https://stackoverflow.com/questions/44493088/format-a-date-string-in-javascript */
function formatDate(userDate) {
    // format from M/D/YYYY to YYYYMMDD
    return (new Date(userDate).toJSON().slice(0,10).split('-').join('-'));
}