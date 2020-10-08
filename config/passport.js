//---------------------------------------------------------
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose")
//--------------------------------------------------------

//-------------------------------------------------
//Source: https://medium.com/front-end-weekly/learn-using-jwt-with-passport-authentication-9761539c4314
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
//------------------------------------------------

// Load User model
const User = mongoose.model("User"); //import the user model;

module.exports = function (passport) {
    //In my case, I am receiving the passport object from somewhere else. Because of that, no need to require passport herein
    /**To set a Passport strategy, you use a passport.use method and pass it a new strategy constructor. */

    //-----------------------------------------------------
    const errorLogin = "Password or username incorrect";
    //-----------------------------------------------------

    //----------------------------------------------------------
    //this strategy is responsible for the JWT verification coming from the frontend
    passport.use(
        new JWTStrategy(
            {
                jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
                secretOrKey: process.env.JWT_SECRET,
            },
            function (jwtPayload, done) {
                const expirationDate = new Date(jwtPayload.exp * 1000);
                if (expirationDate < new Date()) {
                    console.log("token expired");
                    return done(null, false);
                }
                done(null, jwtPayload);
            }
        )
    );//end of strategy for JWT verification
    //-----------------------------------------------------------------

    //--------------------------------------------------------------
    passport.use(
        //By default, a Passport local strategy expects and uses the fields username and password.
        //Passport allows you to override the username field in the options object, as done herein
        new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
            /**
             * Your Mongoose function needs to do the following:
                 Find a user with the email address supplied.
                 Check whether the password is valid.
                 Return the user object if the user is found and the password is valid.
                 Otherwise, return a message stating what’s wrong. 
                */

            // Match user
            //As the email address is set to be unique in the schema, you can use the Mongoose findOne method.
            User.findOne({
                email: email,
            })
                .then((user) => {
                    if (!user) {
                        return done(null, false, {
                            message: errorLogin,
                        });
                    }
                    if (user.status) {//make sure just actived user can enter
                        // Match password
                        bcrypt.compare(password, user.password, (err, isMatch) => {
                            if (err) throw err;
                            //---------------------------------------------------------
                            //here if everything is fine!
                            if (isMatch) {
                                //everything is set! allow login
                                const date = new Date();

                                user.lastLogin = date;
                                user.save();

                                return done(null, user); //return the user
                            }
                            //---------------------------------------------------------
                            else {
                                const date = new Date();
                                user.failedLogin.push(date);
                                user.save();
                                return done(null, false, { message: errorLogin });
                            }
                        });
                    } else {//the user has a account, but not activated yet
                        return done(null, false, {
                            message:
                                `Are you ${user.name}? If so, you must wait for the activation of your account. 
                                You may contact us on teranostico@gmail.com should it take too long, 
                                or for any other query`,
                        });
                    }
                }) //end of then
                .catch((err) => console.log(err)); //end of then

        })
    ); //end of passport

    //-----------------------------------------------------
    //I am not sure I need this section
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
    //-------------------------------------------------------


};//end of passport configuration function
