const pool = require('../config/db');

const TeacherAttendance = {
  // Load schedules (with teacher + subject) by class
  async getSchedulesByClass(class_id) {
    const [rows] = await pool.query(
      `SELECT
          sch.id AS schedule_id,
          sch.day_of_week,
          sch.start_time,
          sch.end_time,
          sch.room_id,
          r.name AS room_name,

          cs.id AS class_subject_id,
          sub.name AS subject_name,
          sub.code AS subject_code,

          t.id AS teacher_id,
          t.first_name,
          t.last_name,
          t.employee_code,
          u.name AS teacher_name

       FROM schedules sch
       JOIN class_subjects cs ON sch.class_subject_id = cs.id
       JOIN subjects sub      ON cs.subject_id = sub.id
       LEFT JOIN teachers t   ON cs.teacher_id = t.id
       LEFT JOIN users u      ON t.user_id = u.id
       LEFT JOIN rooms r      ON sch.room_id = r.id

       WHERE cs.class_id = ?
       ORDER BY sch.day_of_week ASC, sch.start_time ASC`,
      [class_id]
    );
    return rows;
  },

  // create or reuse attendance_sessions by unique (schedule_id, session_date)
  async findOrCreateSession({ schedule_id, session_date, start_time, end_time, status, topic }) {
    const [result] = await pool.query(
      `INSERT INTO attendance_sessions
         (schedule_id, session_date, start_time, end_time, status, topic, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
       ON CONFLICT (schedule_id, session_date) DO UPDATE SET
         start_time = EXCLUDED.start_time,
         end_time = EXCLUDED.end_time,
         status = EXCLUDED.status,
         topic = EXCLUDED.topic,
         updated_at = NOW()`,
      [
        schedule_id,
        session_date,
        start_time || null,
        end_time || null,
        status || 'completed',
        topic || null,
      ]
    );
    return result.insertId;
  },

  async getSessionDetail(schedule_id, session_date) {
    const [rows] = await pool.query(
      `SELECT
          ses.id AS attendance_session_id,
          ses.schedule_id,
          ses.session_date,
          ses.start_time,
          ses.end_time,
          ses.status AS session_status,
          ses.topic,

          sch.day_of_week,
          sch.start_time AS schedule_start_time,
          sch.end_time AS schedule_end_time,

          c.id AS class_id,
          c.name AS class_name,

          sub.name AS subject_name,
          sub.code AS subject_code,

          t.id AS teacher_id,
          t.first_name,
          t.last_name,
          t.employee_code,
          u.name AS teacher_name,

          ta.id AS teacher_attendance_id,
          ta.status AS teacher_status,
          ta.remark AS teacher_remark

       FROM attendance_sessions ses
       JOIN schedules sch        ON ses.schedule_id = sch.id
       JOIN class_subjects cs    ON sch.class_subject_id = cs.id
       JOIN classes c            ON cs.class_id = c.id
       JOIN subjects sub         ON cs.subject_id = sub.id
       LEFT JOIN teachers t      ON cs.teacher_id = t.id
       LEFT JOIN users u         ON t.user_id = u.id
       LEFT JOIN teacher_attendance ta ON ta.attendance_session_id = ses.id

       WHERE ses.schedule_id = ? AND ses.session_date = ?
       LIMIT 1`,
      [schedule_id, session_date]
    );

    return rows[0] || null;
  },

  async upsertTeacherAttendance(attendance_session_id, { status, remark }) {
    const [result] = await pool.query(
      `INSERT INTO teacher_attendance
         (attendance_session_id, status, remark, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW())
       ON CONFLICT (attendance_session_id) DO UPDATE SET
         status = EXCLUDED.status,
         remark = EXCLUDED.remark,
         updated_at = NOW()`,
      [attendance_session_id, status, remark || null]
    );
    return result.insertId;
  },
};

module.exports = TeacherAttendance;
