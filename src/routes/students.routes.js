const express = require('express');
const router = express.Router();
const controller = require('../controllers/students.controller');
const auth = require('../middleware/auth');
const { uploadImage } = require('../utils/fileStore');

// Images are saved in the database (Vercel can't write to uploads/), served at /uploads/students/<filename>
const upload = uploadImage('students');
// List all, single, by class
router.get('/', auth(['admin', 'teacher']), controller.getAll);
router.get('/by-class/:class_id', auth(['admin', 'teacher']), controller.getByClass);
router.get('/:id', auth(['admin', 'teacher']), controller.getOne);

// CRUD
router.post('/', auth('admin'), upload, controller.create);
router.put('/:id', auth('admin'), upload, controller.update);
router.delete('/:id', auth('admin'), upload, controller.remove);

module.exports = router;
 