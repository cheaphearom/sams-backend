const { log } = require('winston');
const jwt = require('jsonwebtoken');
const AttendanceRecords = require('../models/attendanceRecords.model');

exports.getBySchedule = async (req, res, next) => {
  try {
    const data = await AttendanceRecords.getBySchedule(req.params.schedule_id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getAttendaneNotApproved = async (req, res, next) => {
  try {
    const data = await AttendanceRecords.getAllApprovedZero(req.params.schedule_id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.approved = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log('hello');
    
    // if you want client to send approved or not, keep this line.
    // otherwise just force approved = 1.
    const approved = req.body?.approved ?? 1;

    // auth middleware should set req.user (adjust if your middleware uses different name)
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const data = await AttendanceRecords.approved(id, approved, userId);

    if (!data) return res.status(404).json({ message: 'Attendance record not found' });

    res.json(data);
  } catch (err) {
    next(err);
  }
};


exports.upsert = async (req, res, next) => {
  try {
    const item = await AttendanceRecords.upsert(req.body);
    res.status(200).json(item);
  } catch (err) {
    console.log(err);
    
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await AttendanceRecords.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// students 
exports.getByUser = async (req, res, next) => {
  try {

    const userId    = req.params.user_id;
    const startDate = req.query.start_date || null;
    const endDate   = req.query.end_date || null;
    const data = await AttendanceRecords.getByUser(userId,startDate, endDate);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

/**
 * ✅ NEW: Get current active session for this user (student)
 * GET /attendance/current-session/by-user/:user_id
 * Response:
 * {
 *   session: {...} | null,
 *   alreadyCheckedIn: true/false
 * }
 */
exports.getCurrentSessionByUser = async (req, res, next) => {
  try {
    const userId = req.params.user_id;
    const data = await AttendanceRecords.getCurrentSessionByUser(userId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.checkIn = async (req, res, next) => {
  try {
    const { user_id, attendance_session_id, faceToken } = req.body;

    // Must match logged-in user
    if (Number(req.user.id) !== Number(user_id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (!faceToken) {
      return res.status(400).json({ message: 'faceToken required' });
    }

    const decoded = jwt.verify(faceToken, process.env.JWT_SECRET);
    if (decoded.type !== 'face') return res.status(401).json({ message: 'Invalid token' });

    // token must match the same user and session
    if (decoded.userId !== req.user.id || decoded.attendance_session_id !== attendance_session_id) {
      return res.status(401).json({ message: 'Token mismatch' });
    }

    const item = await AttendanceRecords.checkIn({
      user_id,
      attendance_session_id,
      status: 'present',
      remark: 'Self check-in (face verified)',
    });

    res.json(item);
  } catch (e) {
    return res.status(401).json({ message: 'Face token expired/invalid' });
  }
};