const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    labels: { type: [String], required: true }, 
    position: { type: String, required: true }
})


const Form = mongoose.model('Form', formSchema);

module.exports = Form;