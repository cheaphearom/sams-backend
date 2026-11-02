const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const auth = require('../middleware/auth');
const multer = require('multer');

// STORAGE CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/users'),
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, Date.now() + '.' + ext);
  }
});

const upload = multer({ storage });

// Routes (admin only)
router.get('/', auth('admin'), usersController.getAll);
router.post('/', auth('admin'), upload.single('image'), usersController.create);
router.put('/:id', auth('admin'), upload.single('image'), usersController.update);
router.delete('/:id', auth('admin'), usersController.remove);

module.exports = router;
