//----------------------------------------------------------------------------------------
const mongoose = require("mongoose"); //bring in mongoose
const jwt = require("jsonwebtoken");//needed to generate JWT tokens, sent to frontend
//----------------------------------------------------------------------------------------

//------------------------------------------------
var options = { discriminatorKey: "kind" };
//------------------------------------------------

//--------------------------------------------
var randtoken = require("rand-token");
//--------------------------------------------


//------------------------------------------------------------

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            default: "password not defined yet",
        },

        status: {
            type: Boolean,
            default: false,
        },
        level: {
            type: String,
            default: "user",
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        lastLogin: {
            type: Date,
        },
        failedLogin: {
            type: [Date],
            default: [],
        },
        refreshToken: String,//this is used to generate new JWT tokens
    },
    options// this is for the trick of having user groups
);
//----------------------------------------------------------

UserSchema.methods.generateJwt = function () {
    //--------------------------------------------------------------
    //here is where I generate the JWT code
    return jwt.sign(
        {
            name: this.name
        },
        process.env.JWT_SECRET,
        { expiresIn: "15m" } //in seconds
    ); // DO NOT KEEP YOUR SECRET IN THE CODE!
    //--------------------------------------------------------------
};


//------------------------------------------------------
UserSchema.methods.generateRefreshToken = function () {
    this.refreshToken = randtoken.uid(256);
    return this.refreshToken;
};
//------------------------------------------------------

//--------------------------------------------------------
const User = mongoose.model("User", UserSchema); //create a model from our schema
//--------------------------------------------------------


//---------------------------------------------------------
module.exports = User;
//-----------------------------------------------------------