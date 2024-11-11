const mongoose = require('mongoose');

// Common fields schema
const commonFieldsSchema = new mongoose.Schema({
    createdDate : { type: Date, default: Date.now },
    formType: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobileNo: { type: String, required: true },
    location: { type: String, required: true },
    qualification: { type: String },
    clientName: { type: String },
    position: { type: String },
    currentCompany: { type: String },
    overallExperience: { type: Number },
    relevantExperience: { type: Number },
    currentCTC: { type: Number },
    expectedCTC: { type: Number },
    noticePeriod: { type: String },
    interviewMode: { type: String },
    uploadCV: { type: String },  // Path to the uploaded CV
    remarksFirstRecruiter: { type: String },
    recruiterName: { type: String },
    recruiterId : { type: String },
    vendorName: { type: String },
    interviewStatus: { type: String },
    interviewdate: { type: Date },
    interviewTime: { type: String },
    remark1: { type: String },
    remark2: { type: String },
    interviewFinalStatus: { type: String },
    interviewFinalRemark: { type: String },
    shortlistedDate: { type: Date },
    ShortlistRecruiterRemark: { type: String },
    offerStatus: { type: String },
    offerReleasedDate: { type:String },
    shortlistRemark: { type: String },
    shortlistforecast: { type: String },
    offeredCTC: { type: Number },
    billValue: { type: Number },
    expectedDOJ: { type: String },
    joinedStatus: { type: String },
    joinedDate: { type: String },
    joinedshortlistStatus: { type: String },
    joinedSheetremarks: { type: String },
    droppedDate: { type: String },
    droppedshortlistStatus: { type: String },
    onHoldremarks: { type: String },
    onHoldDate: { type: String },
    onHoldshortlistStatus: { type: String },
    onHoldForecast: { type: String },
    lastUpdatedDate: { type: Date, default: Date.now }
}, { _id: false });

// Infosys fields schema
const infosysSchema = new mongoose.Schema({
    candidateID: { type: String },
    role: { type: String },
    jobLevel: { type: String },
    yearsOfExperience: { type: Number },
    preferredLocation: { type: String },
    communicationRating: { type: Number, min: 1, max: 5 },
    shift24x7: { type: String, enum: ['Yes', 'No'] },
    highestEducation: { type: String },
    sourceNameVendor: { type: String },
    dob: { type: Date },
    university: { type: String },
    percentage: { type: Number },
    interviewMode: { type: String },
}, { _id: false });

// Wipro fields schema for Job Code and Resume Id (wipro-1)
const wipro1Schema = new mongoose.Schema({
    jobCode: { type: String },
    resumeId: { type: String },
    skill: { type: String },
    totalExp: { type: Number },
    relevantExp: { type: Number },
    preferredLocation: { type: String },
    payrollOrg: { type: String }
}, { _id: false });

// Wipro fields schema for Band and Gender (wipro-2)
const wipro2Schema = new mongoose.Schema({
    skill: { type: String },
    band: { type: String },
    gender: { type: String },
    preferredLocation: { type: String },
}, { _id: false });

// Accenture fields schema
const accentureSchema = new mongoose.Schema({
    cl: { type: String },
    cid: { type: String },
    gender: { type: String },
    role: { type: String },
    primarySkill: { type: String },
    fatherName: { type: String },
    city: { type: String },
    address: { type: String },
    pincode: { type: String },
    sourceNameVendor: { type: String }
}, { _id: false });



// Main schema combining common fields and company-specific fields
const candidateSchema = new mongoose.Schema({
    common: commonFieldsSchema,
    infosys: infosysSchema,
    wipro1: wipro1Schema,
    wipro2: wipro2Schema,
    accenture: accentureSchema,
    other: { type: mongoose.Schema.Types.Mixed }
});

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;
