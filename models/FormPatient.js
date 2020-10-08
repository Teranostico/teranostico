/**
 * This is the primary form of the patient, the one the doctor will submit alongside the samples
 *
 */

//-------------------------------------------------------------
const mongoose = require("mongoose"); //bring in mongoose
const CryptoJS = require("crypto-js");//this used on the personal information from the patient
//------------------------------------------------------------


//------------------------------------------
//This is for the different options of panel that can be ordered
const geneticRequestPanelSchema = new mongoose.Schema({
    type: String,
    option: String,
});
//--------------------------------------------


//------------------------------------------
//This is for the privacy configuration
const privacySchema = new mongoose.Schema({
    levelofprivacy: String,
    serverConsent: Boolean,
});
//--------------------------------------------

//---------------------------------------------------
//This is the sampling sending details, a sort of header
const sampleSendingDetailsSchema = new mongoose.Schema({
    //header/identifier
    recipient: String,
    //packageDetails
    service: String,
    trackingNumber: String,

    //sender
    firstName: String,
    lastName: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    postalcode: String,

    //contactinfo:
    phoneNumber: String,
    email: String,
});
//---------------------------------------------
//---------------------------------------------
const FormidSchema = new mongoose.Schema({

    patient: { type: mongoose.SchemaTypes.ObjectId, ref: "Patient" },

    submissionDay: {
        type: Date,
        default: Date.now
    },
    privacy: privacySchema,
});
//---------------------------------------------
//---------------------------------------------
const Form1Schema = new mongoose.Schema({
    sampleDate: {
        type: String,
    },
    collectorName: {
        type: String,
    },
    institution: {
        type: String,
    },
    medicalrecord: {
        type: String,
    },
    //-------------------------------------
    //encrypted information
    name: {
        type: String,
        set: encryption,
        get: decryption,
    },
    mothername: {
        type: String,
        set: encryption,
        get: decryption,
    },
    //------------------------------------
    birthday: {
        type: String,
    },
});//end of  Form1Schema
//----------------------------------------------




//------------------------------------------------
//2rd part of the form
const Form2Schema = new mongoose.Schema({
    menopause: {
        type: String,
        //required: true
    },
    weight: {
        type: String,
        //required: true
    },

    height: {
        meter: Number,
        centimeter: Number
    },

    familyhistory: {
        type: String,
        //required: true
    },
    relateddiseases: {
        type: String,
        //required: true
    },
    previouscancers: {
        type: String,
        //required: true
    },
});
//---------------------------------------------

//-------------------------------------------
//3rd form
const Form3Schema = new mongoose.Schema({
    reportid: {
        type: String,
        //required: true
    },
    examdate: {
        type: String,
        //required: true
    },
    selectedTumorType: {
        type: String,
        //required: true
    },
    linfonodos: {
        type: String,
        //required: true
    },
    IMHQ: {
        type: String,
        //required: true
    },
    classification: {
        type: String,
        //required: true
    },

    ESTADIAMENTO: {
        TNM: {
            type: String,
        },
        pTpNM: {
            type: String,
        },
    },
    infiltration: {
        type: String,
        //required: true
    },
    IMHQ: {
        option: String,
        detail: String,
    },
    tumorsize: {
        type: Number,
    },
});
//-----------------------------------------

//-------------------------------------------
//4th form 
const Form4Schema = new mongoose.Schema({
    QUIMIOTERAPIA_NEOADJUVANTE: {
        startingDate: String,
        completionDate: String,
        execution_place: String,
        protocolo: String,
    },

    HORMONIOTERAPIA_NEOADJUVANTE: {
        startingDate: String,
        completionDate: String,
        execution_place: String,
        protocolo: String,
    },
    CIRURGIA_INICIAL: {
        tipo: String,
        axila: String,
        data: String,
    },
    RADIOTERAPIA_ADJUVANTE:
    {
        treatment1: {
            startingDate: String,
            completionDate: String,
            execution_place: String,
            protocolo: String,
        },
        treatment2: {
            startingDate: String,
            completionDate: String,
            execution_place: String,
            protocolo: String,
        },
        treatment3: {
            startingDate: String,
            completionDate: String,
            execution_place: String,
            protocolo: String,
        },
    },
    QUIMIOTERAPIA_ADJUVANTE:
    {
        treatment1: {
            startingDate: String,
            completionDate: String,
            execution_place: String,
            protocolo: String,
        },
        treatment2: {
            startingDate: String,
            completionDate: String,
            execution_place: String,
            protocolo: String,
        },
        treatment3: {
            startingDate: String,
            completionDate: String,
            execution_place: String,
            protocolo: String,
        },
    },
    HORMONIOTERAPIA_ADJUVANTE:
    {
        treatment1: {
            startingDate: String,
            completionDate: String,
            execution_place: String,
            protocolo: String,
        },
        treatment2: {
            startingDate: String,
            completionDate: String,
            execution_place: String,
            protocolo: String,
        },
        treatment3: {
            startingDate: String,
            completionDate: String,
            execution_place: String,
            protocolo: String,
        }
    }

});
//---------------------------------------------

//-------------------------------------------
//4th form 
const Form5Schema = new mongoose.Schema({
    outcoming: String
})

//-------------------------------------------------
//Organizing all the form pages into a single form in Mongo
/**Here we gather all the subdocuments into a single document */
const FormSchema = new mongoose.Schema({
    formid: FormidSchema,
    form1: Form1Schema,
    form2: Form2Schema,
    form3: Form3Schema,
    form4: Form4Schema,
    form5: Form5Schema,
    sampleSendingDetails: sampleSendingDetailsSchema,
    geneticRequestPanel: geneticRequestPanelSchema,
});
//------------------------------------------------ 

//--------------------------------------------------
//Methods section
/**Herein one can find the methods that support on the path manipulations */
/**@description encrypt a information */
function encryption(value) {
    console.log("here on encryption");
    return CryptoJS.AES.encrypt(
        value,
        process.env.encryption_sensitive_patient_information
    );
}
/**@description decrypt a information */
function decryption(value) {
    console.log("here on decryption");
    return CryptoJS.AES.decrypt(
        value,
        process.env.encryption_sensitive_patient_information
    ).toString(CryptoJS.enc.Utf8);
}
//--------------------------------------------------

//---------------------------------------------
/**This is needed for the encrypted information, I need to declare for both the parent and child document, otherwise 
 * it does not work. 
 */
FormSchema.set("toObject", { getters: true });
FormSchema.set("toJSON", { getters: true });

Form1Schema.set("toObject", { getters: true });
Form1Schema.set("toJSON", { getters: true });
//---------------------------------------------


//-----------------------------------------------
//Everything is arranged into Form and exported
mongoose.model("FormPatient", FormSchema);
// module.exports = Form;
//-----------------------------------------------

