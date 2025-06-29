const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session");

const passport = require('passport');
require('./passport-config');

require('dotenv').config()

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const blogsRouter = require('./routes/blogs');
const logoutRouter = require('./routes/logout');
const aboutRouter = require('./routes/about');
const newsletterRouter = require('./routes/newsletter');
const profileRouter = require('./routes/profile');
const resetPasswordRouter = require('./routes/resetPassword');

const authRoute = require('./routes/auth');


const {connectDatabase} = require("./database/database");
const fileUpload = require("express-fileupload");

const app = express();

connectDatabase();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false} // Set secure: true in production with HTTPS
}));
app.use(fileUpload());


app.use(passport.initialize());
app.use(passport.session());


app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/blogs', blogsRouter)
app.use('/logout', logoutRouter)
app.use('/about', aboutRouter)
app.use('/newsletter', newsletterRouter)
app.use('/profile', profileRouter)
app.use('/resetPassword', resetPasswordRouter)
app.use('/auth', authRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
