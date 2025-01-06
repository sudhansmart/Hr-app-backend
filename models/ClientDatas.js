const mongoose = require('mongoose');


const clientListSchema = new mongoose.Schema({
    clientName: {
        type: String
    },
    position: {
        type: String
    },
    gstin: {
        type: String
    },
    address:{
        type : String
    },
     createdDate : {
         type: Date, default: Date.now
         },
   
     
})

const ClientList = mongoose.model('ClientList', clientListSchema);

module.exports = ClientList;