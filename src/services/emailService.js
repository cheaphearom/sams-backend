// services/emailService.js
const nodemailer = require('nodemailer');

// Create a transporter using SMTP with Office 365
const transporter = nodemailer.createTransport({
  service: 'Office365',  // Use Office365 as the service
  host: 'smtp.office365.com',  // SMTP server address
  port: 587,  // Office365 SMTP port (TLS)
  secure: false,  // Use TLS (false if you use port 587)
  auth: {
    user: process.env.SMTP_USER,  // Office365 email (SMTP username)
    pass: process.env.SMTP_PASS   // Generated App Password or regular password
  }
});

// Function to send email
const sendEmail = (to, subject, text, html) => {
  const mailOptions = {
    from: process.env.SMTP_USER,  // Sender address
    to: to,                       // Recipient's email
    subject: subject,             // Email subject
    text: text,                   // Plain text body
    html: html                     // HTML body
  };

  return transporter.sendMail(mailOptions);  // Return the promise
};

module.exports = { sendEmail };
