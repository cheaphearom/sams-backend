// routes/face.route.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const faceController = require('../controllers/face.controller');

router.post('/verify', auth(['student']), faceController.verifyOrEnroll);

module.exports = router;
