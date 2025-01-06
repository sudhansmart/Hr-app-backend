const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require("http");
const { Server } = require("socket.io");

const path = require('path');
dotenv.config();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT ;
const DB_URL = process.env.DB_URL



// Live  Notifications

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with CORS configuration
const io = new Server(server, {
  cors: {
    origin: "http://103.38.50.152", 
    // origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST"],
  },
});

// Live Notifications storage
let notifications = [];

// When a client connects
io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);

  // Send all previous notifications when a user connects
  socket.emit("load_notifications", notifications);

  // Handle admin sending a new notification
  socket.on("send_notification", (data) => {
    const newNotification = {
      id: notifications.length + 1,
      message: data.message,
      time: new Date(),
      read: false,
    };
    notifications.push(newNotification);

    // Emit to all clients
    io.emit("receive_notification", newNotification);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
  });
});


        
// Routes
app.use('/login',require('./routes/recruiters'));
app.use('/candidate',require('./routes/candidate'));
app.use('/labels',require('./routes/lables'));
app.use('/quotes',require('./routes/quotes'));
app.use('/client',require('./routes/clientData'));




mongoose.connect(DB_URL,{})
.then(()=>{
    console.log("MongoDB Connected")
})
.catch((err)=>{
    console.log("MongoDB Not Connected :",err.message)
})


server.listen(PORT, () => console.log(`Server running on port ${PORT}`));