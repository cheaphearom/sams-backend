const express = require('express');
const router = express.Router();
const controller = require('../controllers/attendance.controller');
const auth = require('../middleware/auth');

// Get all attendance for one schedule
router.get(
  '/schedule/:schedule_id',
  auth(['admin', 'teacher']),
  controller.getBySchedule
);

router.get('/not-approved',auth(['admin', 'teacher']),controller.getAttendaneNotApproved);
router.put('/approve/:id', auth(['admin','teacher']), controller.approved);

// Upsert one record (teacher marks attendance)
router.post('/', auth(['admin', 'teacher', 'student']), controller.upsert);

// Delete a record
router.delete('/:id', auth(['admin']), controller.remove);

// students
router.get('/by-user/:user_id', auth(['admin', 'teacher', 'student']), controller.getByUser);
router.get(
  '/current-session/by-user/:user_id',
  auth(['admin', 'teacher', 'student']),
  controller.getCurrentSessionByUser
);
router.post(
  '/check-in',
  auth(['student']),   // self check-in should be student only
  controller.checkIn
);

module.exports = router;
