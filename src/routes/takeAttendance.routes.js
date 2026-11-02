const express = require('express');
const router = express.Router();
const controller = require('../controllers/take_attendance.controller');
const auth = require('../middleware/auth');

router.get('/classes', auth('admin'), controller.getClasses);
router.get('/subjects/:class_id', auth('admin'), controller.getSubjectsByClass);
router.get('/schedules/:class_subject_id', auth('admin'), controller.getSchedulesByClassSubject);
router.get('/students/:class_id', auth('admin'), controller.getStudentsByClass);

router.get('/session', auth('admin'), controller.getSession);
router.post('/submit', auth('admin'), controller.submit);

module.exports = router;
