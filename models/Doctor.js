/**This is the schema for the Doctor, this schema initially will hold just the Doctor
 * e-mail, but the idea is paving teh way for future information insertion
 */
const mongoose = require("mongoose"); //bring in mongoose
const User = mongoose.model("User"); //create a model from our schema
// const util = require("../utils/utils");


//------------------------------------------
//This is for the privacy configuration
const doctorSchema = new mongoose.Schema({
  name: { type: String, default: "not informed" },
  email: String,
  patients: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Patient" }], //this is will store all the patient stored under this Doctor name
  title: String,
  affiliation: String,
  attachedinfo: String,
});
//--------------------------------------------


doctorSchema.virtual("patientsAll", {
  ref: "Patient", //this field works in conjuction with foreignField
  localField: "_id", //this is the local field and should be localField===foreignField when values are assigned
  foreignField: "doctor", //this field works in conjuction with ref <- it should exist in ref
});
//---------------------------------------------

doctorSchema.set("toObject", { virtuals: true });
doctorSchema.set("toJSON", { virtuals: true });

doctorSchema.statics.insertPatient = function (emaildr, created, res) {

  //-------------------------------------------------------------
  this.findOne({ email: emaildr })
    .then((doctor) => {
      if (doctor) {//if doctor already exists, just insert the patient
        // --------------------------------------------
        doctor.patients.push(created._id);
        doctor.save();
        //----------------------------------------
        //---------------------------------------
        created.doctor = doctor._id; //salve the doctors's id to patient
        created.save();
        //------------------------------------------
      } else {//if not, create the doctor and insert patient
        this.create({ email: emaildr, patients: [created._id] })
          .then((doctor) => {
            created.doctor = doctor._id; //salve the doctors's id to patient
            created.save();
          })
          .catch(err => {
            console.log(err);
          });
      }
    })
    .catch((err) => console.log(err));
};
//------------------------------------------------------------

//---------------------------------------------
// mongoose.model("Doctor", doctorSchema); //compile the patient model
User.discriminator("Doctor", doctorSchema);
//---------------------------------------------
