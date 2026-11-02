const express = require('express');
const router = express.Router();
const controller = require('../controllers/teacherSchedule.controller');
const auth = require('../middleware/auth');

router.get('/timetable', auth(['admin', 'teacher']), controller.getTimetable);
router.get('/sessions/upcoming', auth(['admin', 'teacher']), controller.getUpcoming);

module.exports = router;
