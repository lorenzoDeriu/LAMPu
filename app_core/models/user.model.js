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
        type: mongoose.Types.Array,
        required: false
    },
    read_list: {
        type: mongoose.Types.Array,
        required: false
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;