const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user.model');
const bcrypt = require('bcrypt');

function initialize(passport) {
    const authenticateUser = async (username, password, done) => {
        User.findOne({username: username }, async (err, user) => {
            if (err || !user)
                return done(null, false, { message: 'No user with that username' });
            else {
                try {
                    if (await bcrypt.compare(password, user.password)) {
                        console.log('correct password');
                        return done(null, user);
                    } else {
                        console.log('incorrect password');
                        return done(null, false, { message: 'Password incorrect' });
                    }
                } catch(error) {
                    console.log(error);
                    return done(error);
                }
            }
        });
    };

    passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.username));
    passport.deserializeUser((username, done) => {
        User.findOne({ username: username }, (err, user) => {
            if (err)
                return done(err, null);
            return done(null, user);
        });
    });
}


module.exports = initialize;