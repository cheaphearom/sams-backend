const pool = require('../config/db');
const Attendance = require('../services/attendance.service');

const Schedules = {
  async getAll() {
    const [rows] = await pool.query(
      `SELECT sch.*,
              c.name AS class_name,
              s.name AS subject_name,
              r.name AS room_name,
              u.name AS teacher_name
       FROM schedules sch
       JOIN class_subjects cs ON sch.class_subject_id = cs.id
       JOIN classes c ON cs.class_id = c.id
       JOIN subjects s ON cs.subject_id = s.id
       LEFT JOIN rooms r ON sch.room_id = r.id
       LEFT JOIN teachers t ON cs.teacher_id = t.id
       LEFT JOIN users u ON t.user_id = u.id
       ORDER BY c.name ASC, sch.day_of_week ASC, sch.start_time ASC`
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT sch.*,
              c.name AS class_name,
              s.name AS subject_name,
              r.name AS room_name
       FROM schedules sch
       JOIN class_subjects cs ON sch.class_subject_id = cs.id
       JOIN classes c ON cs.class_id = c.id
       JOIN subjects s ON cs.subject_id = s.id
       LEFT JOIN rooms r ON sch.room_id = r.id
       WHERE sch.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async findByClass(class_id) {
    const [rows] = await pool.query(
      `SELECT sch.*
       FROM schedules sch
       JOIN class_subjects cs ON sch.class_subject_id = cs.id
       WHERE cs.class_id = ?
       ORDER BY sch.day_of_week ASC, sch.start_time ASC`,
      [class_id]
    );
    return rows;
  },

  async create({ class_subject_id, room_id, day_of_week, start_time, end_time }) {
    // Step 1: Insert the schedule into the schedules table
    const [result] = await pool.query(
      `INSERT INTO schedules
        (class_subject_id, room_id, day_of_week, start_time, end_time, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [class_subject_id, room_id, day_of_week, start_time, end_time]
    );

    const scheduleId = result.insertId;

    // Step 2: Get the term's start_date and end_date based on the class
    const [termData] = await pool.query(
      `SELECT t.start_date, t.end_date
      FROM terms t
      JOIN classes c ON c.term_id = t.id
      JOIN class_subjects cs ON cs.class_id = c.id
      WHERE cs.id = ?`,
      [class_subject_id]
    );

    if (termData.length === 0) {
      throw new Error('Term data not found for the given class subject.');
    }

    const { start_date, end_date } = termData[0];

    // Step 3: Find all matching days (e.g., all Mondays) between start_date and end_date
    let currentDate = new Date(start_date);
    let attendanceSessions = [];

    // Reset the time to midnight for accurate date comparison
    currentDate.setHours(0, 0, 0, 0);
    let endDate = new Date(end_date);
    endDate.setHours(0, 0, 0, 0);

    // Schedules store Monday = 1 ... Sunday = 7, JavaScript's getDay() has Sunday = 0
    const isoDay = (d) => d.getDay() || 7;
    const ymd = (d) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    let week = 0;
    while (currentDate <= endDate) {
      if (isoDay(currentDate) === Number(day_of_week)) {
        week += 1;
        attendanceSessions.push({
          schedule_id: scheduleId,
          session_date: ymd(currentDate), // a plain date, so no time zone can shift it
          start_time,
          end_time,
          status: 'planned',
          topic: `Week ${week}`,
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (attendanceSessions.length === 0) {
      throw new Error('No matching days found within the term range.');
    }

    // Step 4: Create the sessions (an existing session for the same day is kept)
    for (const session of attendanceSessions) {
      await Attendance.getOrCreateSession(session);
    }

    // Step 5: Return the created schedule along with its attendance sessions
    return this.findById(scheduleId);
  },



  async update(id, { class_subject_id, room_id, day_of_week, start_time, end_time }) {
    await pool.query(
      `UPDATE schedules
       SET class_subject_id = ?, room_id = ?, day_of_week = ?, start_time = ?, end_time = ?, updated_at = NOW()
       WHERE id = ?`,
      [class_subject_id, room_id, day_of_week, start_time, end_time, id]
    );
    return this.findById(id);
  },

  async remove(id) {
    await pool.query('DELETE FROM schedules WHERE id = ?', [id]);
  },

  // student
  async findByUser(user_id) {
    const [rows] = await pool.query(
      `
      SELECT 
          sch.id AS id,
          sch.class_subject_id,
          sch.room_id,
          sch.start_time,
          sch.end_time,
          sch.day_of_week,

          r.name AS room_name,

          sub.name AS subject_name,
          sub.code AS subject_code,

          t.first_name,
          t.last_name,

          cs.class_id,
          c.name AS class_name,
          c.term_id,
          ter.start_date,
          ter.end_date,
          ter.name AS term_name,

          ses.id AS attendance_session_id,
          ses.session_date,
          ses.start_time AS session_start_time,
          ses.end_time AS session_end_time,
          ses.status AS session_status,
          ses.topic AS session_topic,

          CASE WHEN ar.id IS NOT NULL THEN 'Requested' ELSE 'Not Requested' END AS leave_request_status,

          CASE WHEN ar.id IS NULL THEN 'Not Requested' WHEN ar.approved = 1 THEN 'Approved' ELSE 'Not Approved' END AS leave_approval_status

      FROM students s
      JOIN classes c            ON s.class_id = c.id
      JOIN class_subjects cs    ON cs.class_id = c.id
      JOIN schedules sch        ON sch.class_subject_id = cs.id
      JOIN subjects sub         ON cs.subject_id = sub.id
      LEFT JOIN teachers t      ON cs.teacher_id = t.id
      LEFT JOIN rooms r         ON sch.room_id = r.id
      JOIN terms ter            ON c.term_id = ter.id
      LEFT JOIN attendance_sessions ses 
          ON ses.schedule_id = sch.id
      LEFT JOIN attendance_records ar
          ON ar.attendance_session_id = ses.id AND ar.student_id = s.id

      WHERE s.user_id = ?

      ORDER BY 
          ses.session_date,
          sch.day_of_week,
          sch.start_time;

      `,
      [user_id]
    );

    return rows;
  }


};

module.exports = Schedules;
