const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidates');
const PersonalTracker = require('../models/PersonalTracker')
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const contentDisposition = require('content-disposition');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });



  
  // Route to handle file upload
  router.post('/add', upload.single('file'), async (req, res) => {
    const file = req.file;
   
    const data = { ...req.body }; // Spread req.body into a new object

  if (file) {
    data.uploadCV = file.path; // Add file path to the data object
  }   
  const date = new Date();  // current date and time
  data. createdDate = date.toISOString();
    
       try {    
        if (data.formType === 'other') {
          const newCandidate = new Candidate({
            other:  data 
            
          });
            const savedCandidate = await newCandidate.save();
            res.status(200).json(savedCandidate);
        }else{
            const newCandidate = new Candidate({
              common: {
                formType: data.formType,
                name:data.name,
                email:data.email,
                mobileNo:data.phoneNumber,
                location:data.location,
                qualification:data.qualification,
                clientName:data.clientName,
                position:data.role,
                currentCompany:data.currentCompany,
                overallExperience:data.overAllExp,
                relevantExperience:data.relevantExp,
                currentCTC:data.currentCtc,
                expectedCTC:data.expectedCtc,
                noticePeriod:data.noticePeriod,
                interviewMode:data.interviewMode,
                uploadCV: req.file ? req.file.path : '',
                remarksFirstRecruiter:data.remarks ? data.remarks : '',
                recruiterName:data.recruiterName,
                recruiterId:data.recruiterId,
                vendorName:data.vendorName
              },
              infosys:data.infosys || {},
              wipro1:data.wipro1 || {},
              wipro2:data.wipro2 || {},
              accenture:data.accenture || {}
            });
            
            const savedCandidate = await newCandidate.save();
            res.status(200).json(savedCandidate);}
          } catch (error) {
            res.status(400).json({ error: error.message });
            console.log("Error in saving data : ",error);
          }
   
   
  
  });

 // Add Personal Tracker 
router.post('/addpersonaltracker', upload.single('file'), async (req, res) => {
  const file = req.file;
  
  // Spread req.body into a new object and handle file upload
  const data = { ...req.body };

  if (file) {
    data.uploadCV = file.path; // Add file path to the data object
  }
  
  // Add created date
  data.createdDate = Date.now();
  
  console.log('Uploaded file:', file);
  console.log('Data to save:', data);

  try {
    // Create a new PersonalTracker instance with the data object
    const user = new PersonalTracker(data);
    
    // Save the user to the database
    await user.save();
    
    // Respond with the created user data
    res.status(200).json(user);
  } catch (error) {
    console.error('Error occurred while adding personal tracker:', error);
    res.status(500).json({ message: 'Error occurred while adding personal tracker' });
  }
});

// get personal tracker
router.get('/getpersonaltracker', async (req, res) => {
  try {
    const personalTracker = await PersonalTracker.find();
    res.json(personalTracker);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


  // Get all candidates (GET request)
  router.get('/candidatesdata', async (req, res) => {
    try {
      const candidates = await Candidate.find();
      res.json(candidates);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Get a specific candidate by ID (GET request)
  router.get('/candidates/:id', async (req, res) => {
    try {
      const candidate = await Candidate.findById(req.params.id);
      if (!candidate) {
        return res.status(404).json({ error: 'Candidate not found' });
      }
      res.json(candidate);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Update a candidate (PUT request)
  router.put('/updateCandidate/:id', upload.single('file'), async (req, res) => {
    const file = req.file;
    const data = req.body;
  
    console.log("Incoming data:", data);
  
    try {
      // Find the candidate by ID to retrieve existing data
      const candidate = await Candidate.findById(req.params.id);
      if (!candidate) {
        return res.status(404).json({ error: 'Candidate not found' });
      }
  
      // Merge incoming data with the existing data
      const updatedData = {
        common: {
          formType: data.formType || candidate.common.formType,
          name: data.name || candidate.common.name,
          email: data.email || candidate.common.email,
          mobileNo: data.mobileNo || candidate.common.mobileNo,
          location: data.location || candidate.common.location,
          qualification: data.qualification || candidate.common.qualification,
          clientName: data.clientName || candidate.common.clientName,
          position: data.position || candidate.common.position,
          currentCompany: data.currentCompany || candidate.common.currentCompany,
          overallExperience: data.overallExperience || candidate.common.overallExperience,
          relevantExperience: data.relevantExperience || candidate.common.relevantExperience,
          currentCTC: data.currentCTC || candidate.common.currentCTC,
          expectedCTC: data.expectedCTC || candidate.common.expectedCTC,
          noticePeriod: data.noticePeriod || candidate.common.noticePeriod,
          interviewMode: data.interviewMode || candidate.common.interviewMode,
          uploadCV: file ? file.path : candidate.common.uploadCV, // Handle file upload or keep existing one
          remarksFirstRecruiter: data.remarksFirstRecruiter || candidate.common.remarksFirstRecruiter,
          recruiterName: data.recruiterName || candidate.common.recruiterName,
          recruiterId: data.recruiterId || candidate.common.recruiterId,
          interviewStatus: data.interviewStatus || candidate.common.interviewStatus,
          interviewdate: data.interviewdate || candidate.common.interviewdate,
          interviewTime:  data.interviewTime || candidate.common.interviewTime,
          remark1: data.remark1 || candidate.common.remark1,
          remark2: data.remark2 || candidate.common.remark2,
          interviewFinalRemark: data.interviewFinalRemark || candidate.common.interviewFinalRemark,
          offerStatus: data.offerStatus || candidate.common.offerStatus,
          interviewFinalStatus: data.interviewFinalStatus || candidate.common.interviewFinalStatus,
          shortlistedDate: data.shortlistedDate || candidate.common.shortlistedDate,
          offerStatus: data.offerStatus || candidate.common.offerStatus,
          billValue: data.billValue || candidate.common.billValue,
          offeredCTC: data.offeredCTC || candidate.common.offeredCTC,
          joinedStatus: data.joinedStatus || candidate.common.joinedStatus,
          joinedDate: data.joinedDate || candidate.common.joinedDate,
          createdDate: candidate.common.createdDate, 
          ShortlistRecruiterRemark : data.ShortlistRecruiterRemark || candidate.common.ShortlistRecruiterRemark,
          lastUpdatedDate : new Date().toISOString(),
        }
      };
  
      // Update the candidate with the new or existing data
      const updatedCandidate = await Candidate.findByIdAndUpdate(
        req.params.id,
        { $set: updatedData },
        { new: true }
      );
      
      res.json(updatedCandidate);
    } catch (error) {
      res.status(400).json({ error: error.message });
      console.log("Error in updating data: ", error);
    }
  });
  
  
  

  
  // Update an existing personal tracker item by ID with file upload
  router.put('/updatepersonaltracker/:id', upload.single('file'), async (req, res) => {
    const { id } = req.params;
    let updateFields = req.body;
  
    try {
      // Find the item by ID before updating
      const existingItem = await PersonalTracker.findById(id);
  
      if (!existingItem) {
        return res.status(404).json({ message: 'Item not found' });
      }
  
      // Check if a new file was uploaded
      if (req.file) {
        // If the existing item has a file, delete it from the server
        if (existingItem.uploadCV) {
          fs.unlink(existingItem.uploadCV, (err) => {
            if (err) {
              console.error("Error deleting existing file:", err);
            } else {
              console.log("Existing file deleted successfully");
            }
          });
        }
  
        // Save the new file path in the database
        updateFields.uploadCV = req.file.path;
      }
  
      // Update the item in the database
      const updatedItem = await PersonalTracker.findByIdAndUpdate(
        id,
        updateFields,
        { new: true } // Return the updated document
      );
  
      res.status(200).json({
        message: 'Item updated successfully',
        updatedItem,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

  



// Download CV API route
router.get('/download/:candidateId', async (req, res) => {
  try {
    const { candidateId} = req.params;
    
    const candidate = await Candidate.findById(candidateId);
    console.log("check download :",candidate)

    if (!candidate) {
      return res.status(202).json({ message: 'Candidate not found' });
    }
   
    const filePath = candidate.common.uploadCV;
    console.log("check download path :",filePath)

    if (!filePath || filePath.trim() === '') {
      return res.status(201).json({ message: 'CV not found. Please upload.' });
    }
    const candidateName = candidate.common.name.replace(/\s+/g, '_'); // Replace whitespace with underscores
    const fileName = `${candidateName}_CV.pdf`;
    res.setHeader('Content-Disposition', contentDisposition(fileName));
    res.setHeader('Content-Type', 'application/pdf');

    // Create a readable stream from the file and pipe it to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
   
  } catch (error) {
    console.error('Error occurred in Download Route:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

  
  // Delete a candidate (DELETE request)
  router.delete('/candidates/:id', async (req, res) => {
    try {
      const deletedCandidate = await Candidate.findByIdAndDelete(req.params.id);
      if (!deletedCandidate) {
        return res.status(404).json({ error: 'Candidate not found' });
      }
      res.json({ message: 'Candidate deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

 // PUT request to update interview status
router.put('/updatestatus/:id', async (req, res) => {
  try {
    const candidateId = req.params.id;
    const { interviewStatus, uploadCV, } = req.body;

    // Find the candidate by ID
    const candidate = await Candidate.findById(candidateId);

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Check if the form type is 'other'
    if (candidate.other?.formType === 'other') {
      const otherData={
        interviewStatus:interviewStatus,  
        lastUpdatedDate : new Date().toISOString(),
        
      }
      candidate.other = {
        ...candidate.other, // Retain existing 'other' fields
        ...otherData,     // Overwrite with new incoming data
        uploadCV: req.file ? req.file.path : candidate.other.uploadCV // Handle file upload if present
      };
    } else {
      // For `formType` other than 'other', update `common` fields
      if (interviewStatus) {
        candidate.common.interviewStatus = interviewStatus;
        candidate.common.interviewdate = new Date();
        candidate.common.lastUpdatedDate = new Date().toISOString();
      }
    }

    // Save the updated candidate data
    await candidate.save();

    // Respond with the updated candidate data
    res.status(200).json({ message: 'Interview status updated successfully', candidate });
  } catch (error) {
    console.error('Error updating interview status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


 // PUT request to update interview final status
 router.put('/updateinterviewfinalstatus/:id', async (req, res) => {
  try {
    const candidateId = req.params.id;
    const updateData = req.body;

    console.log("Received data:", updateData);
    console.log("Candidate ID:", candidateId);

    // Find the candidate by ID
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Check if the form type is 'other'
    if (candidate.other?.formType === 'other') {
      const { uploadCV, ...otherData } = updateData;
      console.log("Received other data:", otherData);

      // Update the 'other' section
      candidate.other = {
        ...candidate.other,
        ...otherData,
        uploadCV: req.file ? req.file.path : candidate.other.uploadCV,
        lastUpdatedDate: new Date().toISOString(),
      };

      // Check if billingStatus is updated to 'raised' for 'other' type forms
      if (updateData.billingStatus === 'raised') {
        candidate.other.billedDate = new Date();
      }

    } else {
      // For 'common' type forms
      const fieldsToUpdate = [
        'formType', 'interviewdate', 'interviewTime', 'interviewFinalStatus', 
        'remark1', 'remark2', 'interviewFinalRemark', 'remarksFirstRecruiter', 
        'offerStatus', 'shortlistforecast', 'shortlistRemark', 'offerReleasedDate', 
        'offeredCTC', 'billValue', 'expectedDOJ', 'joinedStatus', 'joinedDate', 
        'joinedshortlistStatus', 'joinedSheetremarks', 'droppedDate', 
        'droppedshortlistStatus', 'ShortlistRecruiterRemark', 'onHoldremarks', 
        'onHoldDate', 'onHoldshortlistStatus', 'onHoldForecast', 
        'billingStatus', 'billingPercentage', 'location', 'position', 'role','raisedStatus',
        'invoiceNumber','invoiceDate','gstin','fees','cgst','sgst','igst','invoiceAmount',
        'tds','receivableAmount','receivedDate','balanceAmount','auditReference','billingRemark'
      ];

      // Update only the fields present in the request body
      fieldsToUpdate.forEach((field) => {
        if (updateData[field] !== undefined) {
          candidate.common[field] = updateData[field];
          candidate.common.lastUpdatedDate = new Date().toISOString();

          // Update shortlistedDate if interviewFinalStatus changes
          if (field === 'interviewFinalStatus') {
            candidate.common.shortlistedDate = new Date();
          }

          // Check if billingStatus is updated to 'raised' for 'common' type forms
          if (field === 'billingStatus' && updateData[field] === 'raised') {
            candidate.common.billedDate = new Date();
          }
        }
      });
    }

    // Save the updated candidate
    await candidate.save();
    res.status(200).json({ message: 'Candidate updated successfully', candidate });

  } catch (error) {
    console.error('Error updating interview status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});





// Show PDF
router.get('/pdfs/:id', async (req, res) => {
 
  try {
    const { id } = req.params;
   
    const uploadedFile = await Candidate.findById(id);
  
    if (!uploadedFile) {
      return res.status(404).send('File not found');
    }
    
    if(uploadedFile.other?.formType === 'other'){
      
      res.sendFile(path.resolve(uploadedFile.other.uploadCV));
    }else{
      res.sendFile(path.resolve(uploadedFile.common.uploadCV));
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});  

// Show Personal Tracker PDF


// Show PDF
router.get('/personaltrackerpdfs/:id', async (req, res) => {
 
  try {
    const { id } = req.params;
   
    const uploadedFile = await PersonalTracker.findById(id);
  
    if (!uploadedFile) {
      return res.status(404).send('File not found');
    }
  else{
      res.sendFile(path.resolve(uploadedFile.uploadCV));
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});  



module.exports = router;