const pool = require('../config/db');

const AttendanceSessions = {
  async getAll() {
    const [rows] = await pool.query(
      `SELECT ses.*,

              sch.day_of_week,
              sch.start_time AS schedule_start_time,
              sch.end_time   AS schedule_end_time,

              c.name AS class_name,
              sub.name AS subject_name,
              r.name AS room_name,
              u.name AS teacher_name

       FROM attendance_sessions ses
       JOIN schedules sch        ON ses.schedule_id = sch.id
       JOIN class_subjects cs    ON sch.class_subject_id = cs.id
       JOIN classes c            ON cs.class_id = c.id
       JOIN subjects sub         ON cs.subject_id = sub.id
       LEFT JOIN rooms r         ON sch.room_id = r.id
       LEFT JOIN teachers t      ON cs.teacher_id = t.id
       LEFT JOIN users u         ON t.user_id = u.id

       ORDER BY ses.session_date DESC, c.name ASC, sch.day_of_week ASC, sch.start_time ASC`
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT ses.*,

              sch.day_of_week,
              sch.start_time AS schedule_start_time,
              sch.end_time   AS schedule_end_time,

              c.name AS class_name,
              sub.name AS subject_name,
              r.name AS room_name,
              u.name AS teacher_name

       FROM attendance_sessions ses
       JOIN schedules sch        ON ses.schedule_id = sch.id
       JOIN class_subjects cs    ON sch.class_subject_id = cs.id
       JOIN classes c            ON cs.class_id = c.id
       JOIN subjects sub         ON cs.subject_id = sub.id
       LEFT JOIN rooms r         ON sch.room_id = r.id
       LEFT JOIN teachers t      ON cs.teacher_id = t.id
       LEFT JOIN users u         ON t.user_id = u.id

       WHERE ses.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async findBySchedule(schedule_id) {
    const [rows] = await pool.query(
      `SELECT ses.*
       FROM attendance_sessions ses
       WHERE ses.schedule_id = ?
       ORDER BY ses.session_date DESC`,
      [schedule_id]
    );
    return rows;
  },

  async findByClass(class_id) {
    const [rows] = await pool.query(
      `SELECT ses.*,

              sch.day_of_week,
              sch.start_time AS schedule_start_time,
              sch.end_time   AS schedule_end_time,

              c.name AS class_name,
              sub.name AS subject_name,
              r.name AS room_name

       FROM attendance_sessions ses
       JOIN schedules sch     ON ses.schedule_id = sch.id
       JOIN class_subjects cs ON sch.class_subject_id = cs.id
       JOIN classes c         ON cs.class_id = c.id
       JOIN subjects sub      ON cs.subject_id = sub.id
       LEFT JOIN rooms r      ON sch.room_id = r.id

       WHERE cs.class_id = ?
       ORDER BY ses.session_date DESC, sch.day_of_week ASC, sch.start_time ASC`,
      [class_id]
    );
    return rows;
  },

  async create({ schedule_id, session_date, start_time, end_time, status, topic }) {
    const [result] = await pool.query(
      `INSERT INTO attendance_sessions
         (schedule_id, session_date, start_time, end_time, status, topic, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        schedule_id,
        session_date,
        start_time || null,
        end_time || null,
        status || 'planned',
        topic || null,
      ]
    );
    return this.findById(result.insertId);
  },

  async update(id, { schedule_id, session_date, start_time, end_time, status, topic }) {
    await pool.query(
      `UPDATE attendance_sessions
       SET schedule_id = ?,
           session_date = ?,
           start_time = ?,
           end_time = ?,
           status = ?,
           topic = ?,
           updated_at = NOW()
       WHERE id = ?`,
      [
        schedule_id,
        session_date,
        start_time || null,
        end_time || null,
        status || 'planned',
        topic || null,
        id,
      ]
    );
    return this.findById(id);
  },

  async remove(id) {
    await pool.query('DELETE FROM attendance_sessions WHERE id = ?', [id]);
  },
};

module.exports = AttendanceSessions;
