const express = require('express');
const router = express.Router();
const controller = require('../controllers/teachers.controller');
const auth = require('../middleware/auth');

router.get('/', auth(['admin']), controller.getAll);
router.get('/:id', auth(['admin']), controller.getOne);

router.post('/', auth('admin'), controller.create);
router.put('/:id', auth('admin'), controller.update);
router.delete('/:id', auth('admin'), controller.remove);

module.exports = router;
