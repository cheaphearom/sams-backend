const FixAttendance = require('../models/fixAttendance.model');
const { assertCanManageClass, classIdOfSchedule } = require('../utils/access');

// Teachers may only fix attendance for classes they teach

exports.getSchedulesByClass = async (req, res, next) => {
  try {
    await assertCanManageClass(req.user, req.params.class_id);
    const data = await FixAttendance.getSchedulesByClass(req.params.class_id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// GET /fix-attendance/data?schedule_id=1&session_date=2024-10-07
exports.getFixData = async (req, res, next) => {
  try {
    const { schedule_id, session_date } = req.query;

    if (!schedule_id || !session_date) {
      return res.status(400).json({ message: 'schedule_id and session_date are required' });
    }

    const classId = await classIdOfSchedule(schedule_id);
    if (classId == null) return res.status(404).json({ message: 'Schedule not found' });
    await assertCanManageClass(req.user, classId);

    const attendance_session_id = await FixAttendance.findOrCreateSession({ schedule_id, session_date });
    const session = await FixAttendance.getSessionDetail(attendance_session_id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const students = await FixAttendance.getStudentsByClass(session.class_id);
    const records = await FixAttendance.getRecordsBySession(attendance_session_id);

    res.json({ attendance_session_id, session, students, records });
  } catch (err) {
    next(err);
  }
};

exports.submitFix = async (req, res, next) => {
  try {
    const { schedule_id, session_date, records } = req.body;

    if (!schedule_id || !session_date) {
      return res.status(400).json({ message: 'schedule_id and session_date are required' });
    }

    const classId = await classIdOfSchedule(schedule_id);
    if (classId == null) return res.status(404).json({ message: 'Schedule not found' });
    await assertCanManageClass(req.user, classId);
    if (!Array.isArray(records)) {
      return res.status(400).json({ message: 'records must be an array' });
    }

    const attendance_session_id = await FixAttendance.findOrCreateSession({ schedule_id, session_date });

    await FixAttendance.replaceRecords(attendance_session_id, records);

    res.json({ message: 'Attendance fixed successfully', attendance_session_id });
  } catch (err) {
    next(err);
  }
};
