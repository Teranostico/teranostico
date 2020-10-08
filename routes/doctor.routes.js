//-------------------------------------------------------------------------------------
const express = require("express");
const router = express.Router(); //this is needed because this file is a router collection
//-------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------
const doctorControllers = require("../controllers/doctor.controllers");
//-------------------------------------------------------------------------------------


// --------------------------------------------------
router.get("/getAllDoctors", doctorControllers.findAllDoctors);
// --------------------------------------------------

//-------------------------------------------------------------------
///api/doctors/getAllPatients
router.get("/getAllPatients", doctorControllers.findAllPatients);
//-----------------------------------------------------------------

//-------------------------------------------------------------------
//api/doctors/:id
/**@param(string) doctor's id  - id The doctor MongoDB id */
router.get("/:id", doctorControllers.findDoctorById);
//-----------------------------------------------------------------

module.exports = router; //exports router, as so it can be used elsewhere
