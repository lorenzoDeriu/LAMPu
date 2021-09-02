if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');

// passport
var passport = require('passport');
var flash = require('express-flash');
var session = require('express-session');
var initPassport = require('./config/passport.config');
initPassport(passport);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var userLogin = require('./routes/login');
var registerUser = require('./routes/register');
var booksCategories = require('./routes/categories');
var userToRead = require('./routes/toread');
var logout = require('./routes/logout');
var search = require('./routes/search');

var app = express();

// set connection to MongoDB
const mongoose = require('mongoose');
const db = require('./config/db.config').MongoURI;

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', './layout');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', userLogin);
app.use('/register', registerUser);
app.use('/categories', booksCategories);
app.use('/toread', userToRead);
app.use('/logout', logout);
app.use('/search', search);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { error: err, message: err.message });
});

module.exports = app;
