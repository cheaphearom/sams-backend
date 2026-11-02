const pool = require('../config/db');

const FixAttendance = {
  async getSchedulesByClass(class_id) {
    const [rows] = await pool.query(
      `SELECT
          sch.id AS schedule_id,
          sch.class_subject_id,
          sch.day_of_week,
          sch.start_time,
          sch.end_time,
          sch.room_id,
          r.name AS room_name,

          c.id AS class_id,
          c.name AS class_name,

          sub.name AS subject_name,
          sub.code AS subject_code

       FROM schedules sch
       JOIN class_subjects cs ON sch.class_subject_id = cs.id
       JOIN classes c         ON cs.class_id = c.id
       JOIN subjects sub      ON cs.subject_id = sub.id
       LEFT JOIN rooms r      ON sch.room_id = r.id

       WHERE cs.class_id = ?
       ORDER BY sch.day_of_week ASC, sch.start_time ASC`,
      [class_id]
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

  async findOrCreateSession({ schedule_id, session_date }) {
    const [result] = await pool.query(
      `INSERT INTO attendance_sessions
         (schedule_id, session_date, status, created_at, updated_at)
       VALUES (?, ?, 'completed', NOW(), NOW())
       ON CONFLICT (schedule_id, session_date) DO UPDATE SET
         updated_at = NOW()`,
      [schedule_id, session_date]
    );
    return result.insertId;
  },

  async getSessionDetail(attendance_session_id) {
    const [rows] = await pool.query(
      `SELECT
          ses.*,
          sch.day_of_week,
          sch.start_time AS schedule_start_time,
          sch.end_time AS schedule_end_time,

          c.id AS class_id,
          c.name AS class_name,

          sub.name AS subject_name,
          sub.code AS subject_code,

          r.name AS room_name

       FROM attendance_sessions ses
       JOIN schedules sch        ON ses.schedule_id = sch.id
       JOIN class_subjects cs    ON sch.class_subject_id = cs.id
       JOIN classes c            ON cs.class_id = c.id
       JOIN subjects sub         ON cs.subject_id = sub.id
       LEFT JOIN rooms r         ON sch.room_id = r.id

       WHERE ses.id = ?
       LIMIT 1`,
      [attendance_session_id]
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

  async replaceRecords(attendance_session_id, records = []) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query(
        `DELETE FROM attendance_records WHERE attendance_session_id = ?`,
        [attendance_session_id]
      );

      if (records.length > 0) {
        const values = records.map(r => ([
          attendance_session_id,
          r.student_id,
          r.status,
          r.remark ?? '',
          new Date(),
          new Date(),
        ]));

        await conn.query(
          `INSERT INTO attendance_records
             (attendance_session_id, student_id, status, remark, created_at, updated_at)
           VALUES ?`,
          [values]
        );
      }

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },
};

module.exports = FixAttendance;
