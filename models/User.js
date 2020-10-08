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

// const bcrypt = require("bcryptjs"); //used to encrypt the password


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
        resetpassword: {
            type: String,
        },
        status: {//this variable is responsible to allow access to the account
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
        formSubmitted: [{ type: mongoose.SchemaTypes.ObjectId, ref: "FormPatient" }],
        finalReport_Submitted: [{ type: mongoose.SchemaTypes.ObjectId, ref: "FinalReport" }]
    },
    options// this is for the trick of having user groups
);
//----------------------------------------------------------

UserSchema.methods.generateJwt = function () {
    /**Attention! this token is for user logged in */
    //--------------------------------------------------------------
    //here is where I generate the JWT code
    return jwt.sign(
        {
            _id: this._id, //this is created automatically by Mongo
            name: this.name,
            email: this.email,
            level: this.level,
            lastLogin: this.lastLogin,
            failedLogin: this.failedLogin,
            formSubmitted: this.formSubmitted,
            finalReport_Submitted: this.finalReport_Submitted


        },
        process.env.JWT_SECRET,
        // { expiresIn: "15m" } //in seconds, this is the ideal, but the server of Fiocruz i pretty slow to answer
        { expiresIn: "1d" }
    ); // DO NOT KEEP YOUR SECRET IN THE CODE!
    //--------------------------------------------------------------
};

UserSchema.methods.generateTokenResetPassword = function () {
    /**Attention! this token is for reset password! */
    //--------------------------------------------------------------
    //here is where I generate the JWT code
    this.resetpassword = jwt.sign(
        {
            name: this.name,
            email: this.email,
            level: this.level,

        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" } //in seconds
    ); // DO NOT KEEP YOUR SECRET IN THE CODE!
    //--------------------------------------------------------------
    return this.resetpassword;
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