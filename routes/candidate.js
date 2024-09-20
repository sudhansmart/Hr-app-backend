const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidates');
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
    const data = req.body;
    console.log(file);
    console.log(data);
    try {
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
            res.status(200).json(savedCandidate);
          } catch (error) {
            res.status(400).json({ error: error.message });
            console.log("Error in saving data : ",error);
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
  
  
    try {
        // Find the candidate by ID to retrieve existing data
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        // Construct updatedData object based on incoming data and existing values
        const updatedData = {
            common: {
                formType: data.formType || candidate.common.formType,
                name: data.name || candidate.common.name,
                email: data.email || candidate.common.email,
                mobileNo: data.phoneNumber || candidate.common.mobileNo,
                location: data.location || candidate.common.location,
                qualification: data.qualification || candidate.common.qualification,
                clientName: data.clientName || candidate.common.clientName,
                position: data.role || candidate.common.position,
                currentCompany: data.currentCompany || candidate.common.currentCompany,
                overallExperience: data.overAllExp || candidate.common.overallExperience,
                relevantExperience: data.relevantExp || candidate.common.relevantExperience,
                currentCTC: data.currentCtc || candidate.common.currentCTC,
                expectedCTC: data.expectedCtc || candidate.common.expectedCTC,
                noticePeriod: data.noticePeriod || candidate.common.noticePeriod,
                interviewMode: data.interviewMode || candidate.common.interviewMode,
                uploadCV: file ? file.path : candidate.common.uploadCV, // Keep existing file if no new one
                remarksFirstRecruiter: data.remarks || candidate.common.remarksFirstRecruiter,
                vendorName: data.vendorName || candidate.common.vendorName,
                recruiterName: data.recruiterName || candidate.common.recruiterName,
                recruiterId: data.recruiterId || candidate.common.recruiterId
            },
            // Only save if the field is "true", otherwise keep existing data
            infosys: data.infosys === 'true' ? data.infosys : candidate.infosys,
            wipro1: data.wipro1 === 'true' ? data.wipro1 : candidate.wipro1,
            wipro2: data.wipro2 === 'true' ? data.wipro2 : candidate.wipro2,
            accenture: data.accenture === 'true' ? data.accenture : candidate.accenture,
        };

        // Update the candidate with the new or existing data
        const updatedCandidate = await Candidate.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        res.json(updatedCandidate);
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log("Error in Updating data: ", error);
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
    const { interviewStatus } = req.body;
   

    // Find the candidate by ID and update the interviewStatus
    const candidate = await Candidate.findById(candidateId);
    console.log("interview status :",candidate)

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    } else if (candidate) {
      candidate.common.interviewStatus = interviewStatus;
      candidate.common.interviewdate = new Date();
      await candidate.save();
      res.status(200).json({ message: 'Interview status updated successfully', candidate });
    }
   
  } catch (error) {
    console.error('Error updating interview status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

 // PUT request to update interview final status
 router.put('/updateinterviewfinalstatus/:id', async (req, res) => {
  try {
    const candidateId = req.params.id;
    const { interviewFinalStatus,
              remark1,
              remark2,
              interviewFinalRemark,  
              remarksFirstRecruiter,
              offerStatus,
              shortlistforecast,
              shortlistRemark,
              offerReleasedDate,
              billValue,
              expectedDOJ,
              joinedStatus,
              joinedDate,
              joinedshortlistStatus,
              joinedSheetremarks,
              droppedDate,
              droppedshortlistStatus,
              onHoldremarks,
              onHoldDate,
              onHoldshortlistStatus,
              onHoldForecast,
               offeredCTC,} = req.body;
     console.log("interview final status :",req.body);


    // Find the candidate by ID and update the interviewStatus
    const candidate = await Candidate.findById(candidateId);
    

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    } else if (candidate) {
      if( remarksFirstRecruiter){
        candidate.common.remarksFirstRecruiter = remarksFirstRecruiter
      }
      if (interviewFinalStatus) {
        candidate.common.interviewFinalStatus = interviewFinalStatus;
        candidate.common.shortlistedDate = new Date();
      }
      
      if (remark1) {
        candidate.common.remark1 = remark1;
      }if(remark2) {
        candidate.common.remark2 = remark2;
      }if(interviewFinalRemark) {
        candidate.common.interviewFinalRemark = interviewFinalRemark;
      }if(offerStatus) {
        candidate.common.offerStatus = offerStatus;
      }if(shortlistforecast) {
        candidate.common.shortlistforecast = shortlistforecast;
      }if(shortlistRemark) {
        candidate.common.shortlistRemark = shortlistRemark;
      }if(offeredCTC) {
        candidate.common.offeredCTC = offeredCTC;
      }if(offerReleasedDate){
        candidate.common.offerReleasedDate = offerReleasedDate;
      }if(billValue){
        candidate.common.billValue = billValue;
      }if(expectedDOJ){
        candidate.common.expectedDOJ = expectedDOJ;
      }if(joinedStatus){
        candidate.common.joinedStatus = joinedStatus;
      }if(joinedDate){
        candidate.common.joinedDate = joinedDate;
      }if(joinedshortlistStatus){
        candidate.common.joinedshortlistStatus = joinedshortlistStatus;
      }if(joinedSheetremarks){
        candidate.common.joinedSheetremarks = joinedSheetremarks;
      }if(droppedDate){
        candidate.common.droppedDate = droppedDate;
      }if(droppedshortlistStatus){
        candidate.common.droppedshortlistStatus = droppedshortlistStatus;
      }if(onHoldremarks){
        candidate.common.onHoldremarks = onHoldremarks;
      }if(onHoldDate){
        candidate.common.onHoldDate = onHoldDate;
      }if(onHoldshortlistStatus){
        candidate.common.onHoldshortlistStatus = onHoldshortlistStatus;
      }if(onHoldForecast){
        candidate.common.onHoldForecast = onHoldForecast;
      }
     
      await candidate.save();
      res.status(200).json({ message: 'Interview status updated successfully', candidate });
    }
   
  } catch (error) {
    console.error('Error updating interview status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Show PDF
router.get('/pdfs/:id', async (req, res) => {
  console.log("show :",req.params)
  try {
    const { id } = req.params;
   
    const uploadedFile = await Candidate.findById(id);
    if (!uploadedFile) {
      return res.status(404).send('File not found');
    }
    res.sendFile(path.resolve(uploadedFile.common.uploadCV));
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});  



module.exports = router;