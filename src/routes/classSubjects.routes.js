const express = require('express');
const router = express.Router();
const controller = require('../controllers/classSubjects.controller');
const auth = require('../middleware/auth');

// IMPORTANT: by-class before :id
router.get('/', auth(['admin', 'teacher']), controller.getAll);
router.get('/by-class/:class_id', auth(['admin', 'teacher']), controller.getByClass);
router.get('/:id', auth(['admin', 'teacher']), controller.getOne);

router.post('/', auth('admin'), controller.create);
router.put('/:id', auth('admin'), controller.update);
router.delete('/:id', auth('admin'), controller.remove);

module.exports = router;
