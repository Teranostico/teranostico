
//----------------------------------------------
const passport = require("passport");
const util = require("../utils/utils");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs"); //used to encrypt the password
//-------------------------------------------

const register = function (req, res) {
    /**here I am trusting the frontend will filter out
     * possible problems, e.g., passwords do not match
     */
    const { name, email, password } = req.body; //javascript destructuring

    User.findOne({ email: email }).then(user => {

        if (user) {
            const errors = [];
            errors.push({ msg: "Email already exists in our database" });

            util.sendJSONresponse(res, 409, errors);
        } else {

            const newUser = new User({
                //3 Set the name and email address of the user.
                name,
                email,
                password,
                createdAt: new Date()
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash; //set password to hased
                    //5 Save the user
                    newUser //salve the user
                        .save()
                        .then(() => {
                            //const token = newUser.generateJwt();
                            util.sendJSONresponse(res, 200, {
                                success_msg: "You are now registered and after we double check your credentials you will be able to log in. You may contact us on teranostico@gmail.com",

                            });
                        })
                        .catch((err) => console.log(err));
                }); //end of bcrypt.hash
            }); //end of bcrypt.genSalt
        }
    })

}

const login = function (req, res) {
    passport.authenticate("local", { session: false }, (err, user, info) => {
        //Should anything go wrong
        if (err) {
            /** HTTP 404, 404 Not Found, 404, Page Not Found, or Server Not Found */
            util.sendJSONresponse(res, 404, err);
            return;
        }
        //-------------------------
        if (user) {
            //if found an user and passwork is correct
            const token = user.generateJwt(); //send a token, it will be stored locally in the browser
            const refreshToken = user.generateRefreshToken();

            util.sendJSONresponse(res, 200, {
                token: token,
                refreshToken: refreshToken,
            });

        }
        else {
            /**401 UNAUTHORIZED */
            util.sendJSONresponse(res, 401, info);
        }
    })(req, res); //Makes sure that req and res are available to Passport
    //-----------------------------------------------------------------
}//end of login


//api/users/refreshtoken
const refreshtoken = function (req, res) {
    // console.log("here on refreshtoken ")

    const refreshToken = req.body.refreshToken;

    if (refreshToken) {
        User.findOne({ refreshToken }).then((user) => {
            if (user) {//user found
                const token = user.generateJwt();
                util.sendJSONresponse(res, 200, { token: token });
            } else {//no user found
                let errors = [];
                errors.push({ msg: "invalid refresh token" });
                util.sendJSONresponse(res, 500, errors)
                /**
                 * 500 Internal Server Error server error 
                 * response code indicates that the server encountered an unexpected condition that 
                 * prevented it from fulfilling the request.
                 */
            }
        }).catch((err) => util.sendJSONresponse(res, 500, err));//generic errors
    }//end of if(refreshToken)
}//end of refreshtoken



module.exports = { login, refreshtoken, register }