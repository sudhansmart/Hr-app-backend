const express = require('express');
const router = express.Router();
const { CheckUser ,AddRecruiter} = require('../controllers/recruiters');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get('/checkrecruiter',async(req,res)=>{
   

    try {
        res.status(200).send("Recruiter Details");
       
    } catch (error) {   
        console.log("Error occured at Check checkrecruiter : ",error).message   
    }
}); 


router.post('/addrecruiter', async (req, res) => {
    const { name, userId, password ,role} = req.body;
   

    // Check if the user already exists
    const userExists = await CheckUser(userId);
   

    try {
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
          else{
            AddRecruiter(name, userId, password, role);
            res.status(200).json({ message: "Recruiter added successfully" });
          }
       
    } catch (error) {
        console.error("Error occurred at addRecruiter: ", error.message);
        res.status(500).json({ message: "Internal server error" });
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





module.exports = router;