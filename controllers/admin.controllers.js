/**Keep here all the methods that demand administration credentials */

//----------------------------------------
//database related
const mongoose = require("mongoose");
const User = mongoose.model("User");
//---------------------------------------

//------------------------------------------
//Miscellaneous
const util = require("../utils/utils");
//----------------------------------------

/**
 * @description {this function is responsible for providing a list of user currently in our database}
 * @param {*} req 
 * @param {*} res 
 */
const getAllUsers = function (req, res) {

    User.find().then((result) => {
        const info = [];

        result.forEach((element) => {
            info.push({
                name: element.name,
                typeOfAccount: element.kind ? element.kind : "general account",
                _id: element._id,
                email: element.email,
                resetpassword: element.resetpassword,
                status: element.status,
                level: element.level
            });
        });
        util.sendJSONresponse(res, 200, info);
    });

}

const deleteUserById = function (req, res) {

    User.findByIdAndDelete(req.params.id)
        .then((removed, err) => {
            util.sendJSONresponse(res, 200, removed);
            if (err) util.sendJSONresponse(res, 400, err);
        })
        .catch((err) => util.sendJSONresponse(res, 400, err));
}

/**this method just created a token on the user account, for being
 * used by the user as a reset password validation 
 */
const resetpassword = function (req, res) {

    User.findById(req.params.id)
        .then(user => {
            const token = user.generateTokenResetPassword();

            user.save().then(() =>
                util.sendJSONresponse(res, 200, { token: token }
                )
            )
        })

}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @description This function will switch the current user state (e.g., active to inative)
 */
const switchUserState = function (req, res) {

    const userid = req.body.userid;

    User.findById(userid)
        .then((user) => {
            user.status = !user.status;
            user.save()
                .then(() => {
                    util.sendJSONresponse(res, 200, { success_msg: "change made with success! Please, refresh the users table!" })
                })
                .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err))

}

/**
 * @description this is method will set a user an administrator
 * @param {*} req 
 * @param {*} res 
 */
const setasadmin = function (req, res) {

    const userid = req.body.userid;

    User.findById(userid)
        .then((user) => {
            user.level = "admin";
            user
                .save()
                .then(() =>
                    util.sendJSONresponse(res, 200, { success_msg: `now ${user.name} is an administrator` })
                )
                .catch(err => console.log(err))
        })

}


/**
 * @description this is method will unset a user an administrator
 * @param {*} req 
 * @param {*} res 
 */
const unsetasadmin = function (req, res) {

    const userid = req.body.userid;

    User.findById(userid)
        .then((user) => {
            user.level = "user";
            user
                .save()
                .then(() =>
                    util.sendJSONresponse(res, 200, { success_msg: ` ${user.name} is no longer an administrator` })
                )
                .catch(err => console.log(err))
        })

}

module.exports = { getAllUsers, deleteUserById, resetpassword, switchUserState, setasadmin, unsetasadmin }