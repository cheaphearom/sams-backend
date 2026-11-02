const express = require('express');
const router = express.Router();
const controller = require('../controllers/students.controller');
const auth = require('../middleware/auth');
const multer = require('multer');

// STORAGE CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/students'),
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, Date.now() + '.' + ext);
  }
});

const upload = multer({ storage });
// List all, single, by class
router.get('/', auth(['admin', 'teacher']), controller.getAll);
router.get('/by-class/:class_id', auth(['admin', 'teacher']), controller.getByClass);
router.get('/:id', auth(['admin', 'teacher']), controller.getOne);

// CRUD
router.post('/', auth('admin'), upload.single('image'), controller.create);
router.put('/:id', auth('admin'), upload.single('image'), controller.update);
router.delete('/:id', auth('admin'), upload.single('image'), controller.remove);

module.exports = router;
 