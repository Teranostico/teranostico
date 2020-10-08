//-------------------------------------------------------------------------------------
const express = require("express");
const router = express.Router(); //this is needed because this file is a router collection
//-------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------
const patientControllers = require("../controllers/patient.controllers");
//-------------------------------------------------------------------------------------

// --------------------------------------------------
router.get("/getAllPatients", patientControllers.findAllPatients);
// --------------------------------------------------


// --------------------------------------------------
//api/patients/:id
/**@param(string) id is the mongoDB id of a single patient  */
router.post("/patientcheckerbyid/:id", patientControllers.checkByPatientId);
// --------------------------------------------------


// --------------------------------------------------
//api/patients/:id
/**@param(string) id is the mongoDB id of a single patient  */
router.get("/bypatientid/:id", patientControllers.findPatientByPatientId);
// --------------------------------------------------


// --------------------------------------------------
//api/patients/:id
/**@param(string) id is the mongoDB id of a single patient  */
router.get("/:id", patientControllers.findPatientById);
// --------------------------------------------------



module.exports = router; //exports router, as so it can be used elsewhere
