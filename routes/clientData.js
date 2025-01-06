const express = require('express');
const router = express.Router();
const ClientData = require('../models/ClientDatas');



router.post('/addclient', async (req, res) => {
   
    const data = req.body
      console.log(data)
    try {
     
      const user = new ClientData(data);
      
      // Save the user to the database
      await user.save();
      
      // Respond with the created user data
      res.status(200).json(user);
    } catch (error) {
      console.error('Error occurred while adding Client List:', error);
      res.status(500).json({ message: 'Error occurred while adding Cilent in List' });
    }
  });
  
  // get Client List
  router.get('/getclients', async (req, res) => {
    try {
      const data = await ClientData.find();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
//  delete Client list

router.delete('/deleteclient/:id', async (req, res) => {
  try {
    const deletedClient = await ClientData.findByIdAndDelete(req.params.id);
    if (!deletedClient) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a client by ID
router.put('/updateclient/:id', async (req, res) => {
  const { id } = req.params;
  const { clientName, position } = req.body;
  try {
    const updatedClient = await ClientData.findByIdAndUpdate(
      id,
      { clientName, position },
      { new: true }
    );
    res.status(200).json({ message: 'Client updated successfully', updatedClient });
  } catch (error) {
    res.status(500).json({ message: 'Error updating client', error });
    console.log("error occured at updateclient : ",error)
  }
});

module.exports = router;