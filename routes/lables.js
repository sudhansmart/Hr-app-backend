const express = require('express');
const router = express.Router();
const Form = require('../models/Form')


router.get('/specificlabel/:id', async (req, res) => {
        const { id } = req.params;
        
   try {

    const specificlabel = await Form.findById(id);
    console.log("check specificlabel :",specificlabel)

    if (!specificlabel) {
        return res.status(404).json({ message: 'Label not found' });
    }

    res.json(specificlabel);
    
   } catch (error) {
       console.log("error occured at specificlabel : ",error)
   }

})

router.get('/getlabels', async (req, res) => {
    try {
        const labels = await Form.find();
        res.json(labels);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving labels' });
    }
});

router.post('/addlabel', async (req, res) => {
    const { clientName, labels, position } = req.body;

  try {
    const newLabel = new Form({ clientName, labels, position });
    await newLabel.save();
    res.status(201).json({ message: 'Label saved successfully!', data: newLabel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving label', error: error.message });
  }
})



module.exports = router;