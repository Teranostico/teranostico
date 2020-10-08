/**
 * This is dedicated to routes related to
 * the patient main form, the ones sent alongside the samples
 */
//-------------------------------------------------------------------------
const express = require("express");
const router = express.Router(); //this is needed because this file is a router collection
const ctrlForm = require("../controllers/formPatient.controllers");
//---------------------------------------------------------

//--------------------------------------------------------
// call: /api/patient/form/formid
router.post("/formid", ctrlForm.formidSave);
//--------------------------------------------------------

//--------------------------------------------------------
// call: /api/patient/form/formpage1
router.post("/formpage1", ctrlForm.formPage1Save);
//--------------------------------------------------------

//------------------------------------------------------------------
// call: /api/patient/form/samplesendingdetails
router.post("/samplesendingdetails", ctrlForm.sampleSendingDetails);
//------------------------------------------------------------------


//------------------------------------------------------------------
// call: /api/patient/form/formpage2
router.post("/formpage2", ctrlForm.formPage2Save);
//------------------------------------------------------------------

//------------------------------------------------------------------
// call: /api/patient/form/formpage3
router.post("/formpage3", ctrlForm.formPage3Save);
//------------------------------------------------------------------

//------------------------------------------------------------------
// call: /api/patient/form/formpage4
router.post("/formpage4", ctrlForm.formPage4Save);
//------------------------------------------------------------------

//------------------------------------------------------------------
// call: /api/patient/form/formpage5
router.post("/formpage5", ctrlForm.formPage5Save);
//------------------------------------------------------------------

//------------------------------------------------------------------
// call: /api/patient/form/formpage5
router.get("/finalizesubmission", ctrlForm.finalizeSubmission);
//------------------------------------------------------------------

//------------------------------------------------------------------
// call: /api/patient/form/formpage5
router.get("/getformbyid/:id", ctrlForm.getformbyid);
//------------------------------------------------------------------

module.exports = router;