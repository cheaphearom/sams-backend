// config/nodemailerConfig.js
const nodemailer = require('nodemailer');
require('dotenv').config();  // To use the environment variables

// Create a transporter object using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Use your email provider
  auth: {
    user: process.env.EMAIL_USER,   // Your email address
    pass: process.env.EMAIL_PASS    // Your email password (or app password)
  }
});

module.exports = transporter;
