// Who may touch which attendance data.
// Admins may access everything. A teacher may access a class they teach a
// subject in (class_subjects.teacher_id) or are the homeroom teacher of
// (teacher_classes). Students may only access their own data.
const pool = require('../config/db');
const Teachers = require('../models/teachers.model');

function forbidden(message = 'You do not have access to this class') {
  const err = new Error(message);
  err.status = 403;
  return err;
}

async function teacherIdFor(user) {
  const teacherId = await Teachers.getTeacherIdByUserId(user.id);
  if (!teacherId) throw forbidden('Teacher profile not found for this account');
  return teacherId;
}

async function teacherHasClass(teacherId, classId) {
  const [rows] = await pool.query(
    `SELECT 1 FROM class_subjects WHERE class_id = ? AND teacher_id = ?
     UNION
     SELECT 1 FROM teacher_classes WHERE class_id = ? AND teacher_id = ?
     LIMIT 1`,
    [classId, teacherId, classId, teacherId]
  );
  return rows.length > 0;
}

async function classIdOfSchedule(scheduleId) {
  const [rows] = await pool.query(
    `SELECT cs.class_id FROM schedules sch
     JOIN class_subjects cs ON sch.class_subject_id = cs.id
     WHERE sch.id = ?`,
    [scheduleId]
  );
  return rows[0]?.class_id ?? null;
}

async function classIdOfSession(sessionId) {
  const [rows] = await pool.query(
    `SELECT cs.class_id FROM attendance_sessions asess
     JOIN schedules sch ON asess.schedule_id = sch.id
     JOIN class_subjects cs ON sch.class_subject_id = cs.id
     WHERE asess.id = ?`,
    [sessionId]
  );
  return rows[0]?.class_id ?? null;
}

async function classIdOfRecord(recordId) {
  const [rows] = await pool.query(
    'SELECT attendance_session_id FROM attendance_records WHERE id = ?',
    [recordId]
  );
  return rows[0] ? classIdOfSession(rows[0].attendance_session_id) : null;
}

// Throws 403 unless the user is an admin or a teacher of that class.
// A class that doesn't exist (null) passes, so the caller can answer 404.
async function assertCanManageClass(user, classId) {
  if (user.role === 'admin' || classId == null) return;
  if (user.role !== 'teacher') throw forbidden();
  const teacherId = await teacherIdFor(user);
  if (!(await teacherHasClass(teacherId, classId))) throw forbidden();
}

// Route middleware: a student may only read data for their own user id
function ownUserIdForStudents(param = 'user_id') {
  return (req, res, next) => {
    if (req.user.role === 'student' && Number(req.params[param]) !== Number(req.user.id)) {
      return res.status(403).json({ message: 'You can only view your own attendance' });
    }
    next();
  };
}

module.exports = {
  forbidden,
  assertCanManageClass,
  classIdOfSchedule,
  classIdOfSession,
  classIdOfRecord,
  ownUserIdForStudents,
};
