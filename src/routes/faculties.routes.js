const express = require('express');
const router = express.Router();
const controller = require('../controllers/faculties.controller');
const auth = require('../middleware/auth');
const { uploadImage } = require('../utils/fileStore');

// Images are saved in the database (Vercel can't write to uploads/), served at /uploads/faculties/<filename>
const upload = uploadImage('faculties');

// list + detail
router.get('/', auth(['admin', 'teacher']), controller.getAll);
router.get('/:id', auth(['admin', 'teacher']), controller.getOne);

// admin only (with image)
router.post('/', auth('admin'), upload, controller.create);
router.put('/:id', auth('admin'), upload, controller.update);
router.delete('/:id', auth('admin'), controller.remove);

module.exports = router;
