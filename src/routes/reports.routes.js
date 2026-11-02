const express = require('express');
const router = express.Router();
const controller = require('../controllers/reports.controller');
const auth = require('../middleware/auth');

router.get('/student-attendance', auth(['admin', 'teacher']), controller.studentAttendance);
router.get('/class-attendance', auth(['admin', 'teacher']), controller.classAttendance);
router.get('/subject-attendance', auth(['admin', 'teacher']), controller.subjectAttendance);
router.get('/teacher-attendance', auth(['admin', 'teacher']), controller.teacherAttendance);
router.get('/monthly-summary', auth(['admin', 'teacher']), controller.monthlySummary);

module.exports = router;
