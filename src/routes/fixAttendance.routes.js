const express = require('express');
const router = express.Router();
const controller = require('../controllers/fixAttendance.controller');
const auth = require('../middleware/auth');

router.get('/schedules/by-class/:class_id', auth(['admin', 'teacher']), controller.getSchedulesByClass);
router.get('/data', auth(['admin', 'teacher']), controller.getFixData);
router.post('/submit', auth(['admin', 'teacher']), controller.submitFix);

module.exports = router;
