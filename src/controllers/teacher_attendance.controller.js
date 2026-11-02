const TeacherAttendance = require('../models/teacher_attendance.model');

exports.getSchedulesByClass = async (req, res, next) => {
  try {
    const data = await TeacherAttendance.getSchedulesByClass(req.params.class_id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// GET /teacher-attendance/session?schedule_id=1&session_date=2024-10-07
exports.getSession = async (req, res, next) => {
  try {
    const { schedule_id, session_date } = req.query;

    if (!schedule_id || !session_date) {
      return res.status(400).json({ message: 'schedule_id and session_date are required' });
    }

    // create session if not exists (so teacher_attendance can link to it)
    const attendance_session_id = await TeacherAttendance.findOrCreateSession({
      schedule_id,
      session_date,
      status: 'completed',
    });

    const detail = await TeacherAttendance.getSessionDetail(schedule_id, session_date);

    res.json({
      attendance_session_id,
      detail,
    });
  } catch (err) {
    next(err);
  }
};

exports.submit = async (req, res, next) => {
  try {
    const { schedule_id, session_date, teacher_status, teacher_remark } = req.body;

    if (!schedule_id || !session_date) {
      return res.status(400).json({ message: 'schedule_id and session_date are required' });
    }
    if (!teacher_status) {
      return res.status(400).json({ message: 'teacher_status is required' });
    }

    const attendance_session_id = await TeacherAttendance.findOrCreateSession({
      schedule_id,
      session_date,
      status: 'completed',
    });

    await TeacherAttendance.upsertTeacherAttendance(attendance_session_id, {
      status: teacher_status,
      remark: teacher_remark,
    });

    const detail = await TeacherAttendance.getSessionDetail(schedule_id, session_date);

    res.json({
      message: 'Teacher attendance saved',
      attendance_session_id,
      detail,
    });
  } catch (err) {
    next(err);
  }
};
