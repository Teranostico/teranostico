/**This is the schema for the Final Report, 
 */

//------------------------------------------------------------
//Imports
const mongoose = require("mongoose"); //bring in mongoose
//----------------------------------------------------------


//------------------------------------------
//Patient card schema
const PatientSchema = new mongoose.Schema({
    disease: String,
    Name: String, /** Note 01 09 2020: I may need to encrypt this information */
    sex: String,
    Medical_record: String
});
//--------------------------------------------


//------------------------------------------
//This is for the privacy configuration
const FinalReportSchema = new mongoose.Schema({
    submittedBy: String,
    patient: PatientSchema
});
//--------------------------------------------

//---------------------------------------------
mongoose.model("FinalReport", FinalReportSchema);
//---------------------------------------------