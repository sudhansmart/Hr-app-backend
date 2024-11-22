const mongoose = require('mongoose');
const { create } = require('./Candidates');

const PersonalTrackerSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    location: {
        type: String
    },
    companyName: {
        type: String
    },
    role: {
        type: String
    },
    previousCompany: {
        type: String
    },
    overAllExp: {
        type: Number
    },
    currentCtc: {
        type: Number
    },
    expectedCtc: {
        type: Number
    },
    noticePeriod: {
        type: String
    },
    interviewMode: {
        type: String
    },
    personalTrackStatus:{   
        type: String
    },
    remarks: {
        type: String
    },
    qualification: {
        type: String
    },
    gender: {
        type:String
    },
    skills:{
        type: String
    },
    recruiterId : {
        type: String
    },
    recruiterName: {
        type: String
    },
     createdDate : { type: Date, default: Date.now },
    uploadCV: { 
        type: String
     },
     lastWorkingDay: {
        type: Date
     },
     
})

const PersonalTracker = mongoose.model('PersonalTracker', PersonalTrackerSchema);

module.exports = PersonalTracker;