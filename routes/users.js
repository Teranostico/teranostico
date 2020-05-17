var express = require('express');
var router = express.Router();
const ctrlUsers = require("../controllers/users");


/* login 
endpoint: /api/users/login
*/
router.post('/login', ctrlUsers.login);

router.post('/register', ctrlUsers.register);

//api/users/refreshtoken
router.post("/refreshtoken", ctrlUsers.refreshtoken);


module.exports = router;
