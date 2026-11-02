const express = require('express');
const router = express.Router();
const controller = require('../controllers/teachersSides.controller');
const auth = require('../middleware/auth');

router.get('/:id/classes', auth(['admin', 'teacher']), controller.getClassesByTeacher);
router.get('/:id/classes/:classId/students', auth(['admin', 'teacher']), controller.getStudentsByClass);
router.post('/:id/take-attendance', auth(['admin', 'teacher']), controller.takeAttendance);
router.get('/:id/attendance-history', auth(['admin', 'teacher']), controller.getAttendanceHistory);
router.get('/:id/teacher-attendance', auth(['admin', 'teacher']), controller.getTeacherAttendance);
router.get('/:id/timetable', auth(['admin', 'teacher']), controller.getTeacherTimetable);
router.get('/:id/upcoming-sessions', auth(['admin', 'teacher']), controller.getUpcomingSessions);
router.get('/:id/attendance-report', auth(['admin', 'teacher']), controller.getAttendanceReport);

module.exports = router;
