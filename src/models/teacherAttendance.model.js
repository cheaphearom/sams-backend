const pool = require('../config/db');
const Attendance = require('../services/attendance.service');

const TeacherAttendance = {
  async getBySchedule(schedule_id) {
    const [rows] = await pool.query(
      `SELECT ta.*
       FROM teacher_attendance ta
       WHERE ta.schedule_id = ?`,
      [schedule_id]
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT ta.* FROM teacher_attendance ta WHERE ta.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async create({ schedule_id, date, status, remark }) {
    const [result] = await pool.query(
      `INSERT INTO teacher_attendance (schedule_id, date, status, remark)
       VALUES (?, ?, ?, ?)`,
      [schedule_id, date, status, remark]
    );
    return this.findById(result.insertId);
  },

  async update(id, { schedule_id, date, status, remark }) {
    await pool.query(
      `UPDATE teacher_attendance
       SET schedule_id = ?, date = ?, status = ?, remark = ?
       WHERE id = ?`,
      [schedule_id, date, status, remark, id]
    );
    return this.findById(id);
  },

  async remove(id) {
    await pool.query('DELETE FROM teacher_attendance WHERE id = ?', [id]);
  },
  async listMySessions(teacherId, fromDate, toDate, status) {
    const [rows] = await pool.query(
      `SELECT
         asess.*,
         sch.day_of_week,
         sch.start_time AS scheduled_start_time,
         sch.end_time   AS scheduled_end_time,
         c.id AS class_id,
         c.name AS class_name,
         sub.id AS subject_id,
         sub.name AS subject_name,
         r.name AS room_name
       FROM attendance_sessions asess
       JOIN schedules sch ON asess.schedule_id = sch.id
       JOIN class_subjects cs ON sch.class_subject_id = cs.id
       JOIN classes c ON cs.class_id = c.id
       JOIN subjects sub ON cs.subject_id = sub.id
       LEFT JOIN rooms r ON sch.room_id = r.id
       WHERE cs.teacher_id = ?
         AND asess.session_date >= ?
         AND (?::date IS NULL OR asess.session_date <= ?)
         AND (?::text IS NULL OR asess.status = ?)
       ORDER BY asess.session_date DESC, COALESCE(asess.start_time, sch.start_time) DESC`,
      [teacherId, fromDate, toDate, toDate, status, status]
    );
    return rows;
  },

  async createOrUpdateSession(teacherId, { schedule_id, session_date, start_time, end_time, status, topic }) {
    // verify schedule belongs to teacher
    const [ok] = await pool.query(
      `SELECT sch.id
       FROM schedules sch
       JOIN class_subjects cs ON sch.class_subject_id = cs.id
       WHERE sch.id = ? AND cs.teacher_id = ?
       LIMIT 1`,
      [schedule_id, teacherId]
    );
    if (!ok[0]) return null;

    await Attendance.getOrCreateSession(
      { schedule_id, session_date, start_time, end_time, status, topic },
      { overwrite: true }
    );

    const [rows] = await pool.query(
      `SELECT * FROM attendance_sessions WHERE schedule_id = ? AND session_date = ? LIMIT 1`,
      [schedule_id, session_date]
    );
    return rows[0] || null;
  },

  async getSessionDetailForTeacher(teacherId, sessionId) {
    const [rows] = await pool.query(
      `SELECT
         asess.*,
         c.id AS class_id,
         c.name AS class_name,
         sub.id AS subject_id,
         sub.name AS subject_name,
         r.name AS room_name
       FROM attendance_sessions asess
       JOIN schedules sch ON asess.schedule_id = sch.id
       JOIN class_subjects cs ON sch.class_subject_id = cs.id
       JOIN classes c ON cs.class_id = c.id
       JOIN subjects sub ON cs.subject_id = sub.id
       LEFT JOIN rooms r ON sch.room_id = r.id
       WHERE asess.id = ? AND cs.teacher_id = ?
       LIMIT 1`,
      [sessionId, teacherId]
    );
    return rows[0] || null;
  },

  async getSessionStudentsWithAttendance(teacherId, sessionId) {
    const detail = await this.getSessionDetailForTeacher(teacherId, sessionId);
    if (!detail) return null;

    const [rows] = await pool.query(
      `SELECT
         s.id AS student_id,
         s.student_code,
         s.first_name,
         s.last_name,
         s.image,
         ar.status AS attendance_status,
         ar.remark AS remark,
         ar.source AS attendance_source,
         ar.approved AS attendance_approved,
         ar.reason AS attendance_reason,
         ar.updated_at AS marked_at
       FROM students s
       LEFT JOIN attendance_records ar
         ON ar.student_id = s.id AND ar.attendance_session_id = ?
       WHERE s.class_id = ?
       ORDER BY s.student_code ASC`,
      [sessionId, detail.class_id]
    );

    return { session: detail, students: rows };
  },

  async saveStudentAttendance(teacherId, sessionId, takeByUserId, records = []) {
    const detail = await this.getSessionDetailForTeacher(teacherId, sessionId);
    if (!detail) return null;

    await Attendance.saveSheet(sessionId, records, {
      source: 'teacher',
      markedBy: takeByUserId,
      completeSession: true, // taking attendance completes the session
    });
    return true;
  },

  async upsertTeacherAttendance(teacherId, sessionId, { status, remark }) {
    const detail = await this.getSessionDetailForTeacher(teacherId, sessionId);
    if (!detail) return null;

    await pool.query(
      `INSERT INTO teacher_attendance
         (attendance_session_id, status, remark, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW())
       ON CONFLICT (attendance_session_id) DO UPDATE SET
         status = EXCLUDED.status,
         remark = EXCLUDED.remark,
         updated_at = NOW()`,
      [sessionId, status, remark || null]
    );

    const [rows] = await pool.query(
      `SELECT * FROM teacher_attendance WHERE attendance_session_id = ? LIMIT 1`,
      [sessionId]
    );
    return rows[0] || null;
  },

  async listTeacherAttendanceView(teacherId, fromDate, toDate) {
    const [rows] = await pool.query(
      `SELECT *
       FROM v_teacher_attendance
       WHERE teacher_id = ?
         AND session_date >= ?
         AND (?::date IS NULL OR session_date <= ?)
       ORDER BY session_date DESC`,
      [teacherId, fromDate, toDate, toDate]
    );
    return rows;
  }
};

module.exports = TeacherAttendance;
