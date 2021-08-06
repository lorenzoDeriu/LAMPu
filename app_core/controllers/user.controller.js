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
        subscription: formatDate(new Date())
    });
    console.log(user);
    User.create(user, (err, data) => {
        if (err) {
            console.log(err);
            if (err.code === 'ER_DUP_ENTRY') {
                if (err.sqlMessage.indexOf('PRIMARY') >= 0) {
                    res.render('register', {
                        title: 'Register',
                        error: err,
                        message: "Username already in use"
                    });
                } else {
                    res.render('register', {
                        title: 'Register',
                        error: err,
                        message: "E-mail already in use"
                    });
                }
            } else {
                res.status(500).render('error', {
                    error: err,
                    message: err.message || "Some error occurred while creating the user."
                });
            }
        } else {
            console.log('user created');
            res.send(data);
        }
    });
};

// Retrieve all users from the database.
exports.findAll = (req, res) => {
    User.getAll( (err, data) => {
        if (err) {
            res.status(500).render('error', {
                error: err,
                message: err.message || "Some error occurred while retrieving all the users."
            });
        } else {
            res.send(data);
        }
    });
};

// Find a single user with a username
exports.findOne = (req, res) => {
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
};

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
    User.getToReadList(req.user.username, (err, data) => {
        if (err) {
            if (err.kind === "empty_list") {
                res.render('toread', {
                    name: req.user.name,
                    message: 'No books in the list'
                });
            } else {
                res.status(500).render('error', {
                    error: err,
                    message: err.message || "Some error occurred while retrieving the list."
                });
            }
        } else {
            res.render('toread', { 
                name: req.user.name,
                list: data
            });
        }
    });
};

exports.readBooksList = (req, res) => {
    User.getReadBooksList(req.user.username, (err, data) => {
        if (err) {
            if (err.kind === "empty_list") {
                res.render('readbooks', {
                    name: req.user.name,
                    message: 'No books in the list'
                });
            } else {
                res.status(500).render('error', {
                    error: err,
                    message: err.message || "Some error occurred while retrieving the list."
                });
            }
        } else {
            res.render('readbooks', { 
                name: req.user.name,
                list: data
            });
        }
    });
};

exports.addBookToRead = (req, res) => {
    User.addBookToReadByIsbn(req.user.username, req.body.isbn, (err, data) => {
        if (err) {
            res.status(500).render('error', {
                error: err,
                message: err.message || "Some error occurred while adding the book to the list."
            });
        } else {
            res.render('toread', {
                name: req.user.name,
                message: "Book added to the list",
                refreshButton: true
            });
        }
    })
}

/* https://stackoverflow.com/questions/44493088/format-a-date-string-in-javascript */
function formatDate(userDate) {
    // format from M/D/YYYY to YYYYMMDD
    return (new Date(userDate).toJSON().slice(0,10).split('-').join('-'));
}