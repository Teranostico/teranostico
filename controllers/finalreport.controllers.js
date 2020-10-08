//----------------------------------------
//database related
const mongoose = require("mongoose");
const FinalReport = mongoose.model("FinalReport");
const User = mongoose.model("User");
//---------------------------------------

//-------------------------------------
//imports
const util = require("../utils/utils");
//-------------------------------------


//------------------------------------------------------------
const saveFinalReportHeader = function (req, res) {
    /**General steps:
      * - Save to Mongo;
      * - Save the form id to the user that submitted 
      */
    FinalReport.create(req.body)
        .then((created) => {
            // console.log(req.user);
            User.findById(req.user._id)
                .then((found) => {
                    found.finalReport_Submitted.push(created._id);
                    created.submittedBy = found.name;
                    created.save();
                    found.save();
                });

            util.sendJSONresponse(res, 200, { success_msg: `Patient with medical record ${created.patient.Medical_record} saved with success` });
        })
}
//-------------------------------------------------------------


//-----------------------------------------------------------
const getFinalReportById = function (req, res) {

    // console.log(req.params.id)
    FinalReport.findById(req.params.id)
        .then(found => {
            util.sendJSONresponse(res, 200, found);
        });
}
//---------------------------------------------------------


//--------------------------------------------------
module.exports = { saveFinalReportHeader, getFinalReportById }
//-------------------------------------------------