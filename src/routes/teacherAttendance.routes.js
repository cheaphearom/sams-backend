const express = require('express');
const router = express.Router();
const controller = require('../controllers/teacherAttendance.controller');
const auth = require('../middleware/auth');

// Get teacher attendance by schedule
router.get(
  '/schedule/:schedule_id',
  auth(['admin', 'teacher']),
  controller.getBySchedule
);

// CRUD (usually teacher or admin will create/update)
router.post('/', auth(['admin', 'teacher']), controller.create);
router.put('/:id', auth(['admin', 'teacher']), controller.update);
router.delete('/:id', auth('admin'), controller.remove);

// Take Attendance
router.get('/sessions', auth(['admin', 'teacher']), controller.listSessions);
router.post('/sessions', auth(['admin', 'teacher']), controller.createOrUpdateSession);
router.get('/sessions/:sessionId/students', auth(['admin', 'teacher']), controller.getSessionStudents);
router.post('/sessions/:sessionId/records', auth(['admin', 'teacher']), controller.saveAttendance);

// Teacher Attendance
router.get('/teacher-attendance', auth(['admin', 'teacher']), controller.listTeacherAttendance);
router.post('/sessions/:sessionId/teacher-attendance', auth(['admin', 'teacher']), controller.upsertTeacherAttendance);

module.exports = router;
