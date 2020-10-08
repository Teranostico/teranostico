/**
 * This is dedicated to controlllers related to
 * the patient main form, the ones sent alongside the samples
 */

//-----------------------------------------------------
const mongoose = require("mongoose");
const FormPatient = mongoose.model("FormPatient");
//-------------------------------------------------------

//-------------------------------------------------------
const util = require("../utils/utils");
const authUtils = require("../config/auth");
const User = require("../models/User");
//------------------------------------------------------

//-----------------------------------------------------
const Patient = mongoose.model("Patient");
const Doctor = mongoose.model("Doctor");
//----------------------------------------------------

//------------------------------------------------------
const formVariable = {}; //global variables
//--------------------------------------------------

//------------------------------------------------------

//------------------------------------------------------------
//Form id, this is the first part of the form
const formidSave = function (req, res, next) {

    //-----------------------------------
    //1. take from req.body the values to be saved
    const {
        emaildr,
        patientid,
        levelofprivacy,
        serverConsent,
        patientidSecret,
    } = req.body;
    //     /**if we arrive here, it means we double-checked all the issues,
    //      * and everything is set, just save the patient info */

    //---------------------------------------------------------------
    //Here we see if the user provided a personalized secret
    let secret;
    if (patientidSecret) secret = patientidSecret;
    else secret = process.env.encryption_sensitive_patient_information;
    //------------------------------------------------------------

    const hashedPatientId = authUtils.hashPassword(patientid, secret); //hash the patient id

    //     //-------------------------------------------------------
    //     //try to find the patient, if not, create a new one
    Patient.findOne({ patientID: hashedPatientId })
        .populate("informationForm")
        .then(async (patient) => {
            if (patient) {
                //see if the patient already exists. If patient exists, add this form to his history

                /**if patient already exists, no need to create a Doctor,
                 * since it is created when the patient is created */

                patient.informationForm.push(
                    //-------------------------------------
                    await FormPatient.create({
                        formid: {
                            patient: patient._id, //save the patient id in the just created formid
                            privacy: { levelofprivacy, serverConsent },
                        },
                    })
                        .then((formCreated) => {
                            formVariable.id = formCreated._id; //this is the first method to access the form, so it creates the form and stores locally the id for later access!
                            addFormToUser(req.user._id, formCreated._id);


                            // req.user.formSubmitted.push(formCreated._id)//add the form submitted to the user

                            return formCreated._id;
                        })
                        .catch((err) => {
                            console.log(err);
                            //return util.sendJSONresponse(res, 400, err);
                        })
                    //-----------------------------------------
                );

                //----------------------------------------------------------
                /**When the patient already exists, no need to insert the doctor, it is already inserted when created
                 * Further, when created, it is also added to the doctors list
                 */

                //-----------------------------------------------------------

                patient
                    .save()
                    .then(() => {
                        return util.sendJSONresponse(res, 200, {
                            success_msg: `We spot the patient with id ${patientid} in our database. We will add this new form to his history!`,
                        });
                    })
                    .catch((err) => console.log(err));
            }//end of patient found 
            else {
                //if no patient, creates a new one, and add the form to his forms history
                Patient.create({
                    patientID: hashedPatientId,
                    informationForm: [],
                }).then((created) => {
                    FormPatient.create({
                        formid: {
                            patient: created._id,
                            privacy: { levelofprivacy, serverConsent },
                        },
                    })
                        .then(async formCreated => {
                            formVariable.id = formCreated._id; //this is the first method to access the form, so it creates the form!
                            created.informationForm.push(formCreated._id); //save the form id, as so we can use populate later
                            addFormToUser(req.user._id, formCreated._id);

                            //------------------------------------------------
                            /**I am making sure in the frontend that the user cannot send a doctor email equal a user
                             * already in our database! 
                             */
                            Doctor.insertPatient(emaildr, created);
                            //----------------------------------------------------

                            return util.sendJSONresponse(res, 200, {
                                success_msg: `Form salved to patient with id ${patientid}!`,
                            });

                        })
                        .catch((err) => {
                            console.log(err);
                            //return util.sendJSONresponse(res, 400, err);
                        });
                });
                // //-----------------------------------------------

            } //end of else

            //-----------------------------------------------
        }) //end of patient found
        .catch((err) => console.log(err));

    //     //------------------------------------------------------
    // } //end of else that no error was found
}; //end of formidSave
//-----------------------------------------------------

//----------------------------------------------------
const formPage1Save = function (req, res, next) {

    //------------------------------------------
    /**
     * The frontend supposes to avoid this, but just to make sure!  
    */
    if (!formVariable.id)
        util.sendJSONresponse(res, 400, { error: "you must submit a patient id first" })
    //-------------------------------------------

    //---------------------------------------------
    FormPatient.updateOne(
        { _id: formVariable.id },
        {
            $set: { form1: req.body },
        },
        (err) => {
            if (err) return util.sendJSONresponse(res, 500, errors);
            else {
                formVariable.form1 = true;
                //console.log("okay");
                util.sendJSONresponse(res, 200, { success_msg: "Form salved!" });
            }
        }
    );
    //----------------------------------------------
}//end of  formPage1Save

//---------------------------------------------------

//-------------------------------------------
//salving the address details for send the samples
const sampleSendingDetails = function (req, res, next) {

    // console.log("here on sampleSendingDetails")

    const {
        recipient,
        service,
        trackingNumber,
        firstName,
        lastName,
        address1,
        address2,
        city,
        state,
        postalcode,
        phoneNumber,
        email,
    } = req.body;

    // //console.log(formVariable.id);
    // //-------------------------------------------------------------------
    // //Updating
    // Form.updateOne(
    //     { _id: formVariable.id },
    //     {
    //         $set: {
    //             sampleSendingDetails: {
    //                 recipient,
    //                 service,
    //                 trackingNumber,
    //                 // //}
    //                 // //sender: {
    //                 firstName,
    //                 lastName,
    //                 address1,
    //                 address2,
    //                 city,
    //                 state,
    //                 postalcode,
    //                 //},
    //                 //contactinfo: {
    //                 phoneNumber,
    //                 email,
    //                 //}
    //             },
    //         },
    //     },
    //     (err) => {
    //         if (err) return util.sendJSONresponse(res, 500, errors);
    //         else {
    //             //formVariable.form1 = true;
    //             util.sendJSONresponse(res, 200, { success_msg: "Form salved!" });
    //         }
    //     }
    // ); //end of Form.updateOne

    // //-------------------------------------------------------------------
};//end of sampleSendingDetails
//-------------------------------------------


//--------------------------------------------------
/**@description this is the second page of the patient form */
const formPage2Save = function (req, res, next) {
    FormPatient.updateOne({ _id: formVariable.id },
        { $set: { form2: req.body } },
        (err) => {
            if (err) return util.sendJSONresponse(res, 500, { error_msg: "Something went wrong" });
            else util.sendJSONresponse(res, 200, { success_msg: "Form salved!" });
        })
}
//--------------------------------------------------

const formPage3Save = function (req, res, next) {

    FormPatient.updateOne({ _id: formVariable.id },
        { $set: { form3: req.body } },
        (err) => {
            if (err) {
                console.log(err)
                return util.sendJSONresponse(res, 500, err);
            }
            else util.sendJSONresponse(res, 200, { success_msg: "Form salved!" });
        })
}

const formPage4Save = function (req, res, next) {

    FormPatient.updateOne({ _id: formVariable.id },
        { $set: { form4: req.body } },
        (err) => {
            if (err) {
                console.log(err)
                return util.sendJSONresponse(res, 500, err);
            }
            else util.sendJSONresponse(res, 200, { success_msg: "Form salved!" });
        })
}

const formPage5Save = function (req, res, next) {

    // console.log(req.body)

    FormPatient.updateOne({ _id: formVariable.id },
        { $set: { form5: req.body } },
        (err) => {
            if (err) {
                console.log(err)
                return util.sendJSONresponse(res, 500, err);
            }
            else util.sendJSONresponse(res, 200, { success_msg: "Form salved!" });
        })
}

const finalizeSubmission = function (req, res, next) {

    // console.log(req.body)

    if (formVariable.id) {
        util.sendJSONresponse(res, 200, { success_msg: `${formVariable.id}` });
    }
    else return util.sendJSONresponse(res, 400, { error_msg: `we have no form id` });
}

//-----------------------------------------------------------
const getformbyid = function (req, res, next) {

    FormPatient.findOne({ _id: req.params.id })
        .populate({
            path: "formid.patient",
            populate: { path: "doctor" }
        })
        .then((form) => {
            util.sendJSONresponse(res, 200, form);
        }).catch(err => util.sendJSONresponse(res, 400, err))
}
//-------------------------------------------------------


//---------------------------------------
//Usefull function
const addFormToUser = function (user, formid) {
    User.findById(user)
        .then(user => {
            user.formSubmitted.push(formid);
            user.save();
        })
        .catch(err => console.log(err))
}
//----------------------------------------
module.exports = {
    sampleSendingDetails, formidSave, formPage1Save, formPage2Save, formPage3Save, formPage4Save, formPage5Save,
    finalizeSubmission, getformbyid
}