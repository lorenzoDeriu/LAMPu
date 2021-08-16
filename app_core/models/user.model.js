const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    subscription: {
        type: Date,
        default: Date.now
    },
    to_read_list: {
        type: [String],
        required: false
    },
    read_list: {
        type: [String],
        required: false
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;