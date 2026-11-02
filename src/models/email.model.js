// models/emailModel.js
const transporter = require('../config/nodemailerConfig');

// Function to send the email
const sendEmail = (to, subject, text, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,  // Sender's email
    to: to,                       // Recipient's email
    subject: subject,             // Email subject
    text: text,                   // Plain text body
    html: html                     // HTML body
  };

  return transporter.sendMail(mailOptions);  // Return the promise from nodemailer
};

module.exports = {
  sendEmail
};
