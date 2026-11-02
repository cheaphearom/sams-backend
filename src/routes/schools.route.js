const express = require('express');
const router = express.Router();
const controller = require('../controllers/schools.controller');
const auth = require('../middleware/auth');
const { uploadImage } = require('../utils/fileStore');

// Images are saved in the database (Vercel can't write to uploads/), served at /uploads/schools/<filename>
const upload = uploadImage('schools');

// ✅ public GET routes (no auth)
router.get('/', controller.getAll);
router.get('/:id', controller.getOne);

// admin only (with image)
router.post('/', auth('admin'), upload, controller.create);
router.put('/:id', auth('admin'), upload, controller.update);
router.delete('/:id', auth('admin'), controller.remove);

module.exports = router;
