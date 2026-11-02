const pool = require('../config/db');

const TeacherSchedule = {
  async getMyTimetable(teacherId) {
    const [rows] = await pool.query(
      `SELECT
         sch.id AS schedule_id,
         sch.day_of_week,
         sch.start_time,
         sch.end_time,
         r.id AS room_id,
         r.name AS room_name,
         c.id AS class_id,
         c.name AS class_name,
         sub.id AS subject_id,
         sub.code AS subject_code,
         sub.name AS subject_name
       FROM schedules sch
       JOIN class_subjects cs ON sch.class_subject_id = cs.id
       JOIN classes c ON cs.class_id = c.id
       JOIN subjects sub ON cs.subject_id = sub.id
       LEFT JOIN rooms r ON sch.room_id = r.id
       WHERE cs.teacher_id = ?
       ORDER BY sch.day_of_week ASC, sch.start_time ASC`,
      [teacherId]
    );
    return rows;
  },

  async getUpcomingSessions(teacherId, fromDate, toDate, limit = 50) {
    const [rows] = await pool.query(
      `SELECT
         asess.*,
         sch.day_of_week,
         sch.start_time AS scheduled_start_time,
         sch.end_time   AS scheduled_end_time,
         r.name AS room_name,
         c.id AS class_id,
         c.name AS class_name,
         sub.id AS subject_id,
         sub.name AS subject_name
       FROM attendance_sessions asess
       JOIN schedules sch ON asess.schedule_id = sch.id
       JOIN class_subjects cs ON sch.class_subject_id = cs.id
       JOIN classes c ON cs.class_id = c.id
       JOIN subjects sub ON cs.subject_id = sub.id
       LEFT JOIN rooms r ON sch.room_id = r.id
       WHERE cs.teacher_id = ?
         AND asess.session_date >= ?
         AND (?::date IS NULL OR asess.session_date <= ?)
       ORDER BY asess.session_date ASC, COALESCE(asess.start_time, sch.start_time) ASC
       LIMIT ?`,
      [teacherId, fromDate, toDate, toDate, Number(limit)]
    );
    return rows;
  }
};

module.exports = TeacherSchedule;
