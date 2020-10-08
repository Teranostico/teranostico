
/**
 * This is dedicated to routes related to
 * the final report, the ones sent alongside the samples
 */
//-------------------------------------------------------------------------
//basic imports for any router file
const express = require("express");
const router = express.Router(); //this is needed because this file is a router collection
const ctrlFinalReport = require("../controllers/finalreport.controllers");
//---------------------------------------------------------


router.route("/header").
    post(ctrlFinalReport.saveFinalReportHeader);

router.get("/:id", ctrlFinalReport.getFinalReportById);

//------------------------------------------------------------------
module.exports = router;
//-----------------------------------------------------------------