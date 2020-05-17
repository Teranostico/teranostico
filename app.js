//--------------------------------------------------------
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors"); //we need to cors in order to be able to make calls from different ports
//----------------------------------------------------


var app = express();

//-------------------------------------------
//Server related configuration
require("dotenv").config();
app.use(cors());
//--------------------------------------------

//-----------------------------------
const passport = require("passport"); //Require Passport.

//Connecting and setting database
require("./models/db");

require("./config/passport")(passport); //Require the strategy config.
//---------------------------------------

//-----------------------------------------------------
//router related
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//---------------------------------------------------

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, "./build/public/")));

// app.use('/private', passport.authenticate("jwt", { session: false }), indexRouter);

app.use('/api/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


//----------------------------------------------------
//This will handle all the endpoints now addressed by express to Angular
app.get("*", (req, res) => {
  return res.sendFile(
    path.join(__dirname, "./build/public/index.html")
  );
});
//-----------------------------------------------------------


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
