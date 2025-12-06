require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const fileUpload = require("express-fileupload");

// Routes
const authRoutes = require('./routes/auth.routes'); 
const jobRoutes = require('./routes/job.route');
const applicationRoutes = require('./routes/application.routes');
const userRoutes = require("./routes/user.routes");

// Middleware
const protect = require('./middlewares/auth');
const connectDB = require('./config/db');

// Connect DB
connectDB();

// Core Middlewares (Correct Order)
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());  // USE ONLY ONCE

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/"
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/user', userRoutes);

// Protected test route
app.get('/api/protected', protect, (req, res) => {
  res.json({ message: 'You are authorized', user: req.user });
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log('Server is running on', PORT);
});
