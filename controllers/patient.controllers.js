//----------------------------------------
const mongoose = require("mongoose");
//---------------------------------------

//------------------------------------
const Patient = mongoose.model("Patient");
//----------------------------------

//-------------------------------------
const util = require("../utils/utils");
//-------------------------------------

//---------------------------------------
const authUtils = require("../config/auth");
//----------------------------------------

const findAllPatients = async function (req, res) {

    const patients = await Patient.find({})
        .populate("doctor", "-patients ")
        .lean();
    if (patients.length > 0) {
        const info = patients.map((patient) => {
            const aux = {
                patientID: patient.patientID,
                name: "Patient",
                doctorName: patient.doctor.name,
                doctorEmail: patient.doctor.email,
                description: ` nd regret wished an branch he. Remain bed but expect suffer little repair. `,
                Forms: patient.informationForm,
                _id: patient._id,
            };
            return aux;
        });
        util.sendJSONresponse(res, 200, info);
    } else util.sendJSONresponse(res, 404, { error_msg: "no patient found" });
};

const findPatientById = function (req, res) {
    //console.log(req.params);

    Patient.findById(req.params.id)
        .populate("doctor", "name")
        .then((patient) => {
            const patientInfo = {
                patientID: patient.patientID,
                DoctorsName: patient.doctor.name,
                DoctorsID: patient.doctor._id,
                patientMongoID: patient._id,
            };
            util.sendJSONresponse(res, 200, patientInfo);
        });
};

//-----------------------------------------------------------------------------
const findPatientByPatientId = function (req, res) {

    Patient.findOne({ patientID: req.params.id })
        .then(patient => console.log(patient))
        .catch(err => console(err))

}
//------------------------------------------------------------------------

//------------------------------------------------------------------------
const checkByPatientId = function (req, res) {

    console.log(req.body)

    const { patientidSecret } = req.body;

    //---------------------------------------------------------------
    //Here we see if the user provided a personalized secret
    let secret;
    if (patientidSecret) secret = patientidSecret;
    else secret = process.env.encryption_sensitive_patient_information;
    //------------------------------------------------------------

    const hashedPatientId = authUtils.hashPassword(req.params.id, secret); //hash the patient id

    Patient.findOne({ patientID: hashedPatientId })
        .then((patient) => {
            if (patient)
                util.sendJSONresponse(res, 200, { res: "Patient already in our system :). We shall add this form to his history!" })
            else util.sendJSONresponse(res, 200, null)
        })
        .catch((err) => console.log(err))

}
//----------------------------------------------------------------

module.exports = { findAllPatients, findPatientById, findPatientByPatientId, checkByPatientId };
