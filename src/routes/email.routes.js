// routes/emailRoutes.js
const express = require('express');
const emailController = require('../controllers/email.controller');
const router = express.Router();

// Define POST route to send email
router.post('/send-email', emailController.sendEmailHandler);

module.exports = router;
