const { log } = require('winston');
const jwt = require('jsonwebtoken');
const AttendanceRecords = require('../models/attendanceRecords.model');
const Teachers = require('../models/teachers.model');
const {
  assertCanManageClass,
  classIdOfSchedule,
  classIdOfSession,
  classIdOfRecord,
} = require('../utils/access');

// What a student may ask for in a leave request. "present" only comes from
// scanning the QR code or from a teacher, never from the student directly.
const STUDENT_REQUEST_STATUSES = ['absent', 'late'];

exports.getBySchedule = async (req, res, next) => {
  try {
    await assertCanManageClass(req.user, await classIdOfSchedule(req.params.schedule_id));
    const data = await AttendanceRecords.getBySchedule(req.params.schedule_id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getAttendaneNotApproved = async (req, res, next) => {
  try {
    const teacherId =
      req.user.role === 'teacher' ? await Teachers.getTeacherIdByUserId(req.user.id) : null;
    if (req.user.role === 'teacher' && !teacherId) return res.json([]);

    const data = await AttendanceRecords.getAllApprovedZero(
      req.query.start_date || null,
      req.query.end_date || null,
      teacherId
    );
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

    const classId = await classIdOfRecord(id);
    if (classId == null) return res.status(404).json({ message: 'Attendance record not found' });
    await assertCanManageClass(req.user, classId);

    const data = await AttendanceRecords.approved(id, approved, userId);

    if (!data) return res.status(404).json({ message: 'Attendance record not found' });

    res.json(data);
  } catch (err) {
    next(err);
  }
};


// POST /attendance
// Students: send a leave request for their own record (always pending approval).
// Teachers: only for classes they teach. Admins: any class.
exports.upsert = async (req, res, next) => {
  try {
    const body = { ...req.body };
    if (!body.attendance_session_id) {
      return res.status(400).json({ message: 'attendance_session_id is required' });
    }

    const classId = await classIdOfSession(body.attendance_session_id);
    if (classId == null) return res.status(404).json({ message: 'Attendance session not found' });

    if (req.user.role === 'student') {
      // Never trust who, or the approval, from the request body
      body.user_id = req.user.id;
      body.approved = 0;
      if (!body.reason || body.reason === 'attendance_records') body.reason = 'other';

      if (!STUDENT_REQUEST_STATUSES.includes(body.status)) {
        return res.status(400).json({ message: 'A leave request can only be for absent or late' });
      }

      const { student, record } = await AttendanceRecords.findStudentRecord(
        body.attendance_session_id,
        req.user.id
      );
      if (!student) return res.status(404).json({ message: 'Student not found for this user' });
      if (Number(student.class_id) !== Number(classId)) {
        return res.status(403).json({ message: 'You are not in this class' });
      }

      // A student may only edit their own request while it is still pending;
      // anything recorded by a teacher or by the QR scan, or already approved, is locked
      const ownPendingRequest =
        record &&
        Number(record.approved) === 0 &&
        Number(record.take_by) === Number(student.id) &&
        record.reason !== 'attendance_records';
      if (record && !ownPendingRequest) {
        return res.status(409).json({ message: 'Attendance for this session is already recorded' });
      }
    } else {
      await assertCanManageClass(req.user, classId);
    }

    const item = await AttendanceRecords.upsert(body);
    res.status(200).json(item);
  } catch (err) {
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