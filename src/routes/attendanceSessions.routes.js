const express = require('express');
const router = express.Router();
const controller = require('../controllers/attendanceSessions.controller');
const auth = require('../middleware/auth');

router.get('/', auth(['admin', 'teacher']), controller.getAll);
router.get('/by-schedule/:schedule_id', auth(['admin', 'teacher']), controller.getBySchedule);
router.get('/by-class/:class_id', auth(['admin', 'teacher']), controller.getByClass);

// ✅ must be before "/:id"
router.get('/:id', auth(['admin', 'teacher']), controller.getOne);

router.post('/', auth(['admin', 'teacher']), controller.create);
router.put('/:id', auth(['admin', 'teacher']), controller.update);
router.delete('/:id', auth(['admin', 'teacher']), controller.remove);

module.exports = router;
