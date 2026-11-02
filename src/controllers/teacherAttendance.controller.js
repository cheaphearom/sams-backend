const TeacherAttendance = require('../models/teacherAttendance.model');
const Teachers = require('../models/teachers.model');

exports.getBySchedule = async (req, res, next) => {
  try {
    const data = await TeacherAttendance.getBySchedule(req.params.schedule_id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const item = await TeacherAttendance.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const item = await TeacherAttendance.update(req.params.id, req.body);
    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await TeacherAttendance.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
async function resolveTeacherId(req) {
  if (req.user?.role === 'teacher') return Teachers.getTeacherIdByUserId(req.user.id);
  if (req.user?.role === 'admin') return Number(req.query.teacher_id) || null;
  return null;
}

exports.listSessions = async (req, res, next) => {
  try {
    const teacherId = await resolveTeacherId(req);
    if (!teacherId) return res.status(400).json({ message: 'Teacher not found' });

    const from = req.query.from || '2000-01-01';
    const to = req.query.to || null;
    const status = req.query.status || null;

    const data = await TeacherAttendance.listMySessions(teacherId, from, to, status);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.createOrUpdateSession = async (req, res, next) => {
  try {
    const teacherId = await resolveTeacherId(req);
    if (!teacherId) return res.status(400).json({ message: 'Teacher not found' });

    const item = await TeacherAttendance.createOrUpdateSession(teacherId, req.body);
    if (!item) return res.status(403).json({ message: 'Schedule not allowed' });

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

exports.getSessionStudents = async (req, res, next) => {
  try {
    const teacherId = await resolveTeacherId(req);
    if (!teacherId) return res.status(400).json({ message: 'Teacher not found' });

    const data = await TeacherAttendance.getSessionStudentsWithAttendance(
      teacherId,
      req.params.sessionId
    );
    if (!data) return res.status(404).json({ message: 'Session not found' });

    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.saveAttendance = async (req, res, next) => {
  try {
    const teacherId = await resolveTeacherId(req);
    if (!teacherId) return res.status(400).json({ message: 'Teacher not found' });

    const ok = await TeacherAttendance.saveStudentAttendance(
      teacherId,
      req.params.sessionId,
      req.user.id, // take_by uses users.id in many apps
      req.body.records || []
    );
    if (!ok) return res.status(404).json({ message: 'Session not found' });

    res.json({ message: 'Attendance saved' });
  } catch (err) {
    next(err);
  }
};

exports.upsertTeacherAttendance = async (req, res, next) => {
  try {
    const teacherId = await resolveTeacherId(req);
    if (!teacherId) return res.status(400).json({ message: 'Teacher not found' });

    const item = await TeacherAttendance.upsertTeacherAttendance(
      teacherId,
      req.params.sessionId,
      req.body
    );
    if (!item) return res.status(404).json({ message: 'Session not found' });

    res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.listTeacherAttendance = async (req, res, next) => {
  try {
    const teacherId = await resolveTeacherId(req);
    if (!teacherId) return res.status(400).json({ message: 'Teacher not found' });

    const from = req.query.from || '2000-01-01';
    const to = req.query.to || null;

    const data = await TeacherAttendance.listTeacherAttendanceView(teacherId, from, to);
    res.json(data);
  } catch (err) {
    next(err);
  }
};