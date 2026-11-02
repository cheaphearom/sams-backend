const sgMail = require('@sendgrid/mail');
require('dotenv').config();  // Load environment variables from .env

// Set the SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Function to send email
const sendEmail = (to, subject, text, html) => {
  const msg = {
    to: to,
    from: process.env.SENDGRID_EMAIL,  // Use your verified SendGrid email
    subject: subject,
    text: text,
    html: html,
  };

  return sgMail.send(msg);
};

module.exports = { sendEmail };
