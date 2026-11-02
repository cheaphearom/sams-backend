const express = require('express');
const router = express.Router();
const controller = require('../controllers/departments.controller');
const auth = require('../middleware/auth');

router.get('/', auth(['admin', 'teacher']), controller.getAll);
router.get('/by-faculty/:faculty_id', auth(['admin', 'teacher']), controller.getByFaculty);

// ✅ must be before "/:id"
router.get('/:id', auth(['admin', 'teacher']), controller.getOne);

router.post('/', auth('admin'), controller.create);
router.put('/:id', auth('admin'), controller.update);
router.delete('/:id', auth('admin'), controller.remove);

module.exports = router;
