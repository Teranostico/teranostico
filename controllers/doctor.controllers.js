//----------------------------------------
const mongoose = require("mongoose");
//---------------------------------------

//------------------------------------
const Doctor = mongoose.model("Doctor");
const User = mongoose.model("User");
//----------------------------------

//-------------------------------------
const util = require("../utils/utils");
//-------------------------------------

const findAllDoctors = async function (req, res) {
  const doctors = await Doctor.find().populate({
    path: "patients",
    // populate: { path: "patientID" },
    select: "-doctor",
  });

  const info = [];
  doctors.forEach((element) => {
    return info.push({
      name: "Doctor",
      email: element.email,
      doctorName: element.name,
      DoctorID: element._id,
      description: element.description,
    });
  });

  util.sendJSONresponse(res, 200, info);
};

//-----------------------------------------------------------------------
const findAllPatients = function (req, res) {
  Doctor.find({})
    // .populate("patientsAll", "-patientsAll.doctor")
    .exec((err, result) => {
      res.json(result);
    });
};
//------------------------------------------------------------------------

//-----------------------------------------------------------------------
const findDoctorById = function (req, res) {
  // console.log(req.params);
  Doctor.findById(req.params.id)
    // .populate("patientsAll", "-patientsAll.doctor")
    .exec((err, result) => {
      const info = {
        name: result.name,
        email: result.email,
        title: result.title,
        affiliation: result.affiliation,
        description: result.attachedinfo,
      };

      res.json(info);
    });
};
//------------------------------------------------------------------------



module.exports = { findAllDoctors, findAllPatients, findDoctorById };
