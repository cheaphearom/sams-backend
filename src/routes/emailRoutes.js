// routes/emailRoutes.js
const express = require('express');
const emailController = require('../controllers/emailController');
const router = express.Router();

// POST route to send email
router.post('/send-email', emailController.sendEmailHandler);

module.exports = router;
