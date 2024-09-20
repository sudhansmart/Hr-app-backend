const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
dotenv.config();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT ;
const DB_URL = process.env.DB_URL


// Routes
app.use('/login',require('./routes/recruiters'));
app.use('/candidate',require('./routes/candidate'));





mongoose.connect(DB_URL,{})
.then(()=>{
    console.log("MongoDB Connected")
})
.catch((err)=>{
    console.log("MongoDB Not Connected :",err.message)
})


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));