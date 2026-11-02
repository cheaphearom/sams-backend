// controllers/emailController.js
const emailService = require('../services/emailService');

// Controller to handle sending email
const sendEmailHandler = async (req, res) => {
  const { to, subject, text, html } = req.body;

  try {
    // Call the sendEmail function from the service
    const response = await emailService.sendEmail(to, subject, text, html);
    res.status(200).json({ success: true, message: 'Email sent successfully', response });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { sendEmailHandler };
