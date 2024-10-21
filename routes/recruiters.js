const express = require('express');
const router = express.Router();
const { CheckUser ,AddRecruiter} = require('../controllers/recruiters');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Recruiters = require('../models/Recruiters');

router.get('/checkrecruiter',async(req,res)=>{
   

    try {
       const recruiters = await Recruiters.find();
        
        res.status(200).send(recruiters);
       
    } catch (error) {   
        console.log("Error occured at Check checkrecruiter : ",error).message   
    }
}); 


router.post('/addrecruiter', async (req, res) => {
    const { name, userId, password ,role} = req.body;
     console.log("check addrecruiter :",name,userId,password,role)

    // Check if the user already exists
    const userExists = await CheckUser(userId);
    console.log("check addrecruiter :",userExists)

    try {
        if (userExists) {
            res.status(201).send({ message: "User already exists" });
        }
          else{
            AddRecruiter(name, userId, password, role);
            res.status(200).send({ message: "Recruiter added successfully" });
          }
       
    } catch (error) {
        console.error("Error occurred at addRecruiter: ", error.message);
        res.status(400).send({ message: "Internal server error" });
    }
});
// Login API 
  router.post('/userin', async (req, res) => {
    const { userId, password } = req.body;

    try {
      const user = await CheckUser(userId);
   
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const token = jwt.sign({ userId: user._id,name : user.name, role: user.role }, process.env.JWT_SECRET);
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Error occurred at login: ', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

// Update recruiter
router.put('/updateRecruiter/:id', async (req, res) => {
  try {
      const { password, ...updateData } = req.body;

      if (password) {
          // Hash the new password before updating
          const hashedPassword = await bcrypt.hash(password, 10);
          updateData.password = hashedPassword;
      }

      const recruiter = await Recruiters.findByIdAndUpdate(req.params.id, updateData, { new: true });

      if (!recruiter) {
          return res.status(201).json({ message: 'Recruiter not found' });
      }

      res.status(200).json({ message: 'Recruiter updated successfully', recruiter });
  } catch (error) {
      console.error('Error updating recruiter:', error);
      res.status(500).json({ message: 'Failed to update recruiter' });
  }
});



module.exports = router;