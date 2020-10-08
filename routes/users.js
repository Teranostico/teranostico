/**
 * Routers responsible for user related actions that can be done by any user * 
 */

var express = require('express');
var router = express.Router();
const ctrlUsers = require("../controllers/users");


/* login 
endpoint: /api/users/login
*/
router.post('/login', ctrlUsers.login);

router.post('/register', ctrlUsers.register);

router.post('/resetpassword', ctrlUsers.resetpassword);

//api/users/refreshtoken
router.post("/refreshtoken", ctrlUsers.refreshtoken);

//---------------------------------------------------------------------------------
//Keep the routes with parameters last
router.post("/resetpasswordwithtoken/:jwt", ctrlUsers.resetpasswordWithToken);
router.get("/verify/:jwt", ctrlUsers.verifyToken);
//------------------------------------------------------------------------------

// --------------------------------------------------
router.post("/checkemail", ctrlUsers.checkemail);
// --------------------------------------------------

module.exports = router;
