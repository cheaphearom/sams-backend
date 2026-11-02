const pool = require('../config/db');

const TakeAttendance = {
  async getClasses() {
    const [rows] = await pool.query(
      `SELECT id, name
       FROM classes
       ORDER BY name ASC`
    );
    return rows;
  },

  async getSubjectsByClass(class_id) {
    const [rows] = await pool.query(
      `SELECT
          cs.id AS class_subject_id,
          sub.id AS subject_id,
          sub.code AS subject_code,
          sub.name AS subject_name,
          cs.teacher_id,
          u.name AS teacher_name
       FROM class_subjects cs
       JOIN subjects sub ON cs.subject_id = sub.id
       LEFT JOIN teachers t ON cs.teacher_id = t.id
       LEFT JOIN users u ON t.user_id = u.id
       WHERE cs.class_id = ?
       ORDER BY sub.name ASC`,
      [class_id]
    );
    return rows;
  },

  async getSchedulesByClassSubject(class_subject_id) {
    const [rows] = await pool.query(
      `SELECT
          sch.*,
          r.name AS room_name
       FROM schedules sch
       LEFT JOIN rooms r ON sch.room_id = r.id
       WHERE sch.class_subject_id = ?
       ORDER BY sch.day_of_week ASC, sch.start_time ASC`,
      [class_subject_id]
    );
    return rows;
  },

  async getStudentsByClass(class_id) {
    const [rows] = await pool.query(
      `SELECT
          id,
          student_code,
          first_name,
          last_name
       FROM students
       WHERE class_id = ?
       ORDER BY student_code ASC, first_name ASC`,
      [class_id]
    );
    return rows;
  },

  async getSessionByScheduleAndDate(schedule_id, session_date) {
    const [rows] = await pool.query(
      `SELECT *
       FROM attendance_sessions
       WHERE schedule_id = ? AND session_date = ?
       LIMIT 1`,
      [schedule_id, session_date]
    );
    return rows[0] || null;
  },

  async getRecordsBySession(attendance_session_id) {
    const [rows] = await pool.query(
      `SELECT ar.*,
              st.student_code,
              st.first_name,
              st.last_name
       FROM attendance_records ar
       JOIN students st ON ar.student_id = st.id
       WHERE ar.attendance_session_id = ?
       ORDER BY st.student_code ASC, st.first_name ASC`,
      [attendance_session_id]
    );
    return rows;
  },
};

module.exports = TakeAttendance;
