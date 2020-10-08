/**This is the schema for the patient, this schema initially will hold just the patient
 * id, but the idea is paving teh way for future information insertion
 */
const mongoose = require("mongoose"); //bring in mongoose

//------------------------------------------
//This is for the privacy configuration
const patientSchema = new mongoose.Schema({
    patientID: String, //id of the patient
    birthday: String, //date of birth
    informationForm: [{ type: mongoose.SchemaTypes.ObjectId, ref: "FormPatient" }], //this is for the general information form
    doctor: { type: mongoose.SchemaTypes.ObjectId, ref: "Doctor" }, //Patient's doctor
});
//--------------------------------------------

//---------------------------------------------
mongoose.model("Patient", patientSchema); //compile the patient model
//---------------------------------------------
