const express = require('express');
const router = express.Router();
const controller = require('../controllers/schools.controller');
const auth = require('../middleware/auth');
const multer = require('multer');

// STORAGE CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/schools'),
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, Date.now() + '.' + ext);
  }
});

const upload = multer({ storage });

// ✅ public GET routes (no auth)
router.get('/', controller.getAll);
router.get('/:id', controller.getOne);

// admin only (with image)
router.post('/', auth('admin'), upload.single('image'), controller.create);
router.put('/:id', auth('admin'), upload.single('image'), controller.update);
router.delete('/:id', auth('admin'), controller.remove);

module.exports = router;
