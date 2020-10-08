const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();

const hashPassword = function (
  plainText,
  secret = process.env.encryption_sensitive_patient_information
) {
  return crypto
    .createHmac(process.env.Secret_hash_Password, secret)
    .update(plainText)
    .digest("hex");
};

module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Please log in to view that resource");
    res.redirect("/users/login");
  },
  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/dashboard");
  },
  hashPassword,
};
