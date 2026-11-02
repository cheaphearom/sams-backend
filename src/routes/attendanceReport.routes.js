// routes/attendanceReport.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/attendanceReport.controller');
const auth = require('../middleware/auth');

// GET /attendance-report/schedule/:schedule_id
// Example: /attendance-report/schedule/5
router.get(
  '/schedule/:schedule_id',
  auth(['admin', 'teacher']),
  controller.getSummaryBySchedule
);

module.exports = router;
