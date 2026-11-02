const express = require('express');
const router = express.Router();
const controller = require('../controllers/dashboard.controller');
const auth = require('../middleware/auth');

// GET /dashboard
router.get('/', auth(['admin', 'teacher']), controller.getDashboardData);
router.get('/student/:user_id', auth(['student']), controller.getDashboardDataStudent);

module.exports = router;
