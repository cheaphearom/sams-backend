const pool = require('../config/db');

const Reports = {

  // =========================================================
  // Student Attendance
  // GET /reports/student-attendance
  // =========================================================
  async studentAttendance({ student_id, from, to }) {
    const conditions = [];
    const params = [];

    if (student_id) {
      conditions.push('v.student_id = ?');
      params.push(student_id);
    }
    if (from) {
      conditions.push('v.session_date >= ?');
      params.push(from);
    }
    if (to) {
      conditions.push('v.session_date <= ?');
      params.push(to);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [rows] = await pool.query(
      `
      SELECT
        v.student_id,
        v.student_code,
        v.student_name,
        v.class_id,
        v.class_name,
        v.subject_id,
        v.subject_name,
        v.teacher_id,
        v.teacher_name,
        v.session_date,
        v.attendance_status,
        v.remark
      FROM v_student_attendance v
      ${where}
      ORDER BY v.session_date DESC
      `,
      params
    );

    return rows;
  },

  // =========================================================
  // Class Attendance Summary
  // GET /reports/class-attendance
  // =========================================================
  async classAttendance({ class_id }) {
    if (!class_id) return [];

    const [rows] = await pool.query(
      `
      SELECT
        v.class_id,
        v.class_name,
        v.student_count,
        v.present_count,
        v.absent_count,
        v.late_count,
        v.total_records,
        ROUND(
          CASE WHEN v.total_records = 0 THEN 0
               ELSE (v.present_count::numeric / v.total_records) * 100
          END
        , 2) AS present_percent
      FROM v_class_attendance_summary v
      WHERE v.class_id = ?
      `,
      [class_id]
    );

    return rows;
  },

  // =========================================================
  // Subject Attendance Summary
  // GET /reports/subject-attendance
  // =========================================================
  async subjectAttendance({ subject_id, class_id }) {
    if (!subject_id) return [];

    const conditions = ['v.subject_id = ?'];
    const params = [subject_id];

    if (class_id) {
      conditions.push('v.class_id = ?');
      params.push(class_id);
    }

    const where = `WHERE ${conditions.join(' AND ')}`;

    const [rows] = await pool.query(
      `
      SELECT
        v.subject_id,
        v.subject_name,
        v.class_id,
        v.class_name,
        v.student_id,
        v.student_name,
        v.present_count,
        v.absent_count,
        v.late_count,
        v.total_records,
        v.present_percent
      FROM v_subject_attendance_summary v
      ${where}
      ORDER BY v.class_name, v.student_name
      `,
      params
    );

    return rows;
  },

  // =========================================================
  // Teacher Attendance
  // GET /reports/teacher-attendance
  // =========================================================
  async teacherAttendance({ teacher_id, from, to }) {
    const conditions = [];
    const params = [];

    if (teacher_id) {
      conditions.push('v.teacher_id = ?');
      params.push(teacher_id);
    }
    if (from) {
      conditions.push('v.session_date >= ?');
      params.push(from);
    }
    if (to) {
      conditions.push('v.session_date <= ?');
      params.push(to);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [rows] = await pool.query(
      `
      SELECT
        v.teacher_id,
        v.teacher_name,
        v.class_id,
        v.class_name,
        v.subject_id,
        v.subject_name,
        v.session_date,
        v.attendance_status,
        v.remark
      FROM v_teacher_attendance v
      ${where}
      ORDER BY v.session_date DESC
      `,
      params
    );

    return rows;
  },

  // =========================================================
  // Monthly Attendance Summary
  // GET /reports/monthly-summary
  // =========================================================
  async monthlySummary({ ym }) {
    const conditions = [];
    const params = [];

    if (ym) {
      conditions.push('v.ym = ?');
      params.push(ym);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [rows] = await pool.query(
      `
      SELECT
        v.ym,
        v.class_id,
        v.class_name,
        v.student_count,
        v.present_count,
        v.absent_count,
        v.late_count,
        v.total_records,
        v.present_percent
      FROM v_monthly_attendance_summary v
      ${where}
      ORDER BY v.ym DESC, v.class_name
      `,
      params
    );

    return rows;
  }
};

module.exports = Reports;
