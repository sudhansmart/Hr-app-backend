const express = require('express');
const router = express.Router();
const Quotes = require('../models/Quotes')


router.get('/getquotes',async(req,res)=>{
   

    try {
       const quote = await Quotes.find();
       
        res.status(200).send(quote);
       
    } catch (error) {   
        console.log("Error occured at Check checkrecruiter : ",error).message   
    }
}); 

module.exports = router;