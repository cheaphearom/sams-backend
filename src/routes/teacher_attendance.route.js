const express = require('express');
const router = express.Router();
const controller = require('../controllers/teacher_attendance.controller');
const auth = require('../middleware/auth');

router.get('/schedules/by-class/:class_id', auth('admin'), controller.getSchedulesByClass);
router.get('/session', auth('admin'), controller.getSession);
router.post('/submit', auth('admin'), controller.submit);

module.exports = router;
