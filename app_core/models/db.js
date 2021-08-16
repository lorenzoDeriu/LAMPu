const mongoose = require('mongoose');
const db = require('../config/db.config').MongoURI;

mongoose.connect(db, { useNewUrlParser: true})
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));