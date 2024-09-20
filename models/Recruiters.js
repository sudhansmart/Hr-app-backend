const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {   
    name:{
       type: String,
        required: true 
      },
    userId: 
    { type: String, 
      required: true,
       unique: true
       },
    password: String,
    role: 
     { type: String
      },
    token: String,
    createdAt: 
    {
      type: Date,
      default: Date.now  
    }
  },
  {
    collection: 'Recruiters'
  }
);

module.exports = mongoose.model("User", userSchema);
