const TakeAttendance = require('../models/take_attendance.model');
const Attendance = require('../services/attendance.service');

exports.getClasses = async (req, res, next) => {
  try {
    const data = await TakeAttendance.getClasses();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getSubjectsByClass = async (req, res, next) => {
  try {
    const data = await TakeAttendance.getSubjectsByClass(req.params.class_id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getSchedulesByClassSubject = async (req, res, next) => {
  try {
    const data = await TakeAttendance.getSchedulesByClassSubject(req.params.class_subject_id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getStudentsByClass = async (req, res, next) => {
  try {
    const data = await TakeAttendance.getStudentsByClass(req.params.class_id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// ?schedule_id=1&session_date=2024-10-07
exports.getSession = async (req, res, next) => {
  try {
    const { schedule_id, session_date } = req.query;
    if (!schedule_id || !session_date) {
      return res.status(400).json({ message: 'schedule_id and session_date are required' });
    }

    const session = await TakeAttendance.getSessionByScheduleAndDate(schedule_id, session_date);
    if (!session) return res.json({ session: null, records: [] });

    const records = await TakeAttendance.getRecordsBySession(session.id);
    res.json({ session, records });
  } catch (err) {
    next(err);
  }
};

exports.submit = async (req, res, next) => {
  try {
    const { schedule_id, session_date, start_time, end_time, status, topic, records } = req.body;

    if (!schedule_id || !session_date) {
      return res.status(400).json({ message: 'schedule_id and session_date are required' });
    }
    if (!Array.isArray(records)) {
      return res.status(400).json({ message: 'records must be an array' });
    }

    const attendance_session_id = await Attendance.getOrCreateSession(
      { schedule_id, session_date, start_time, end_time, status: status || 'completed', topic },
      { overwrite: true }
    );

    await Attendance.saveSheet(attendance_session_id, records, {
      source: 'admin',
      markedBy: req.user.id,
    });

    res.json({ message: 'Attendance saved', attendance_session_id });
  } catch (err) {
    next(err);
  }
};
