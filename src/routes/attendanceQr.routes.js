  // routes/attendanceQr.routes.js
  const express = require('express');
  const router = express.Router();
  const controller = require('../controllers/attendanceQr.controller');
  const auth = require('../middleware/auth');
  // Teacher generates QR token for an attendance session
  router.post(
    '/qr/create',
    auth(['teacher']),   // or ['admin','teacher'] if admin can also generate
    controller.createQrForSession
  );

// Student checks in by scanning QR
router.post(
  '/qr/checkin',
  auth(['student']),   // self check-in should be student only
  controller.checkInByQr
);

module.exports = router;
