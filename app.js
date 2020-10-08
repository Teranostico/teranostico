//--------------------------------------------------------
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors"); //we need to cors in order to be able to make calls from different ports
//----------------------------------------------------


var app = express();


const util = require("./utils/utils");
const jwt = require('express-jwt');

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
const indexRouter = require('./routes/admin.routes');
const usersRouter = require('./routes/users');
const userRouter = require('./routes/user.routes');
const formPatientRouter = require('./routes/formPatient.routes');
const patientRouter = require('./routes/patient.routes');
const doctorsRouter = require('./routes/doctor.routes');
const finalReportRouter = require('./routes/finalreport.routes');
//---------------------------------------------------

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, "./build/public")));


//------------------------------------------------------------------------------------------------
app.use('/api/admin',
  passport.authenticate("jwt", { session: false }), jwt({ secret: process.env.JWT_SECRET }), //this will double check the jwt(e.g., validity)
  util.isAdmin, //make sure the user has administration level
  indexRouter);//give access to routers if everything is fine

app.use('/api/users', usersRouter);
//-----------------------------------------------------------
//These routes are especific for users loggedin
app.use(
  '/api/user', passport.authenticate("jwt", { session: false }), jwt({ secret: process.env.JWT_SECRET }), //this will double check the jwt(e.g., validity)
  userRouter);
//------------------------------------------------------------
//--------------------------------------------------------

app.use('/api/patient/form',
  //-----------------------
  //this will double check the jwt(e.g., validity)
  passport.authenticate("jwt", { session: false }), jwt({ secret: process.env.JWT_SECRET }),
  formPatientRouter);
//--------------------

//------------------------------
app.use('/api/finalreport',

  //-----------------------
  //this will double check the jwt(e.g., validity)
  passport.authenticate("jwt", { session: false }), jwt({ secret: process.env.JWT_SECRET }),
  //-----------------------

  finalReportRouter);
//--------------------------

app.use('/api/patients', patientRouter);
app.use('/api/doctors', doctorsRouter);

//-------------------------------------------------------


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
