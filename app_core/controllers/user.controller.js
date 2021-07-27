const User = require("../models/user.model.js");

// Create and Save a new user
exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create the new user
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        surname: req.body.surname,
        date: formatDate(new Date())
    });

    User.create(user, (err, data) => {
        if (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the user."
            });
        } else {
            res.send(data);
        }
    });
};

// Retrieve all users from the database.
exports.findAll = (req, res) => {
    User.getAll( (err, data) => {
        if (err) {
            res.status(500).send({
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
          if (err.kind === "not_found") {
            res.status(404).send({
                message: `Not found user with username ${req.params.username}.`
            });
          } else {
            res.status(500).send({
                message: "Error retrieving user with username " + req.params.username
            });
          }
        } else res.send(data);
      });
};

// Update a user identified by the username in the request
exports.update = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    User.updateById(req.params.username,
        new User(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found user with username ${req.params.username}.`
                    });
                } else {
                    res.status(500).send({
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
                res.status(404).send({
                    message: `Not found user with username ${req.params.username}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete user with username " + req.params.username
                })
            }
        } else {
            res.send({ message: `User deleted!`});
        }
    })
};

/* https://stackoverflow.com/questions/44493088/format-a-date-string-in-javascript */
function formatDate(userDate) {
    // format from M/D/YYYY to YYYYMMDD
    return (new Date(userDate).toJSON().slice(0,10).split('-').reverse().join('-'));
}