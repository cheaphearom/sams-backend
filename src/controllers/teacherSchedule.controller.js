const Teachers = require('../models/teachers.model');
const TeacherSchedule = require('../models/teacherSchedule.model');

async function resolveTeacherId(req) {
  if (req.user?.role === 'teacher') return Teachers.getTeacherIdByUserId(req.user.id);
  if (req.user?.role === 'admin') return Number(req.query.teacher_id) || null;
  return null;
}

exports.getTimetable = async (req, res, next) => {
  try {
    const teacherId = await resolveTeacherId(req);
    if (!teacherId) return res.status(400).json({ message: 'Teacher not found' });

    const data = await TeacherSchedule.getMyTimetable(teacherId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.getUpcoming = async (req, res, next) => {
  try {
    const teacherId = await resolveTeacherId(req);
    if (!teacherId) return res.status(400).json({ message: 'Teacher not found' });

    const from = req.query.from || new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const to = req.query.to || null;
    const limit = req.query.limit || 50;

    const data = await TeacherSchedule.getUpcomingSessions(teacherId, from, to, limit);
    res.json(data);
  } catch (err) {
    next(err);
  }
};
