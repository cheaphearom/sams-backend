const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const auth = require('../middleware/auth');
const { uploadImage } = require('../utils/fileStore');

// Images are saved in the database (Vercel can't write to uploads/), served at /uploads/users/<filename>
const upload = uploadImage('users');

// Routes (admin only)
router.get('/', auth('admin'), usersController.getAll);
router.post('/', auth('admin'), upload, usersController.create);
router.put('/:id', auth('admin'), upload, usersController.update);
router.delete('/:id', auth('admin'), usersController.remove);

module.exports = router;
