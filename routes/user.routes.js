/**
 * Routers responsible for user related actions that can be done by any user * 
 */

var express = require('express');
var router = express.Router();
const ctrlUser = require("../controllers/user.controllers");


/* login 
endpoint: /api/user/failedlogin/:id
*/
router.put("/failedlogin/:id", ctrlUser.failedlogin);

router.put("/", ctrlUser.update);



module.exports = router;
