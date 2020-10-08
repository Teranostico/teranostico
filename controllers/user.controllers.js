/**The methods herein a for loggedin users */

//----------------------------------------------
const util = require("../utils/utils");
const mongoose = require("mongoose");
const User = mongoose.model("User");
//-------------------------------------------



const failedlogin = function (req, res) {

    User.updateOne({ _id: req.params.id }, { $set: { failedLogin: [] } },

        (err) => {
            if (err) {
                util.sendJSONresponse(res, 400, err);
            }
            util.sendJSONresponse(res, 200,
                { success_msg: "we just clear all the failed login attempts. You may need to logout and log in account." })
        })
}


const update = function (req, res) {
    delete req.body._id; //this is needed to avoid conflict when creating a new one, in case it does exist
    //console.log(req.body);
    // util.sendJSONresponse(res, 200, "okay");
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    User.findOneAndUpdate(
        { email: req.body.email },
        { $set: req.body },
        options,
        (err, doc) => {
            // console.log(doc);
            if (err) throw err;
            util.sendJSONresponse(
                res,
                200,
                `we just updated the user ${doc.name}. Refresh the the users table`
            );
        }
    );
}



module.exports = { failedlogin, update }