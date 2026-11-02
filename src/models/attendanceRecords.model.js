const pool = require("../config/db");
const Attendance = require("../services/attendance.service");

const AttendanceRecords = {
  async getBySchedule(schedule_id) {
    const [rows] = await pool.query(
      `SELECT ar.*, u.name AS student_name
       FROM attendance_records ar
       JOIN students s ON ar.student_id = s.id
       JOIN users u ON s.user_id = u.id
       WHERE ar.schedule_id = ?`,
      [schedule_id]
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT ar.*, u.name AS student_name
       FROM attendance_records ar
       JOIN students s ON ar.student_id = s.id
       JOIN users u ON s.user_id = u.id
       WHERE ar.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  // The student row for a user, and their existing record in a session (if any)
  async findStudentRecord(attendance_session_id, user_id) {
    const [students] = await pool.query(
      'SELECT id, class_id FROM students WHERE user_id = ? LIMIT 1',
      [user_id]
    );
    if (students.length === 0) return { student: null, record: null };

    const [records] = await pool.query(
      `SELECT id, source, reason, approved FROM attendance_records
       WHERE attendance_session_id = ? AND student_id = ?
       ORDER BY id DESC LIMIT 1`,
      [attendance_session_id, students[0].id]
    );
    return { student: students[0], record: records[0] || null };
  },

  async getAllApprovedZero(start_date = null, end_date = null, teacher_id = null) {
    let query = `
      SELECT 
        ar.*,
        u.name AS student_name,
        s.first_name as student_first_name,
        s.last_name as student_last_name,
        tc.first_name as teacher_first_name,
        tc.last_name as teacher_last_name,
        ses.session_date,
        ses.start_time AS session_start_time,
        ses.end_time AS session_end_time,
        ses.status AS session_status,
        ses.topic AS session_topic,
        c.name as class_name,
        sj.name as subject_name
      FROM attendance_records ar
      JOIN attendance_sessions ses 
        ON ar.attendance_session_id = ses.id
      JOIN schedules sd
        ON ses.schedule_id = sd.id
      JOIN class_subjects sc 
          ON sd.class_subject_id = sc.id
      JOIN classes c 
        ON sc.class_id = c.id
      JOIN subjects sj
        ON sc.subject_id = sj.id
      JOIN teachers tc
        ON sc.teacher_id = tc.id
      JOIN students s 
        ON ar.student_id = s.id
      JOIN users u 
        ON s.user_id = u.id
      WHERE ar.approved = 0
    `;

    const queryParams = [ ];

    if (teacher_id) {
      query += ` AND (sc.teacher_id = ? OR EXISTS (
        SELECT 1 FROM teacher_classes tcl WHERE tcl.class_id = c.id AND tcl.teacher_id = ?))`;
      queryParams.push(teacher_id, teacher_id);
    }

    // If both start_date and end_date are provided, add date filtering to the query
    if (start_date && end_date) {
      query += ' AND ses.session_date BETWEEN ? AND ?';
      queryParams.push(start_date, end_date);
    }

    // If no date parameters are provided, it will fetch all records where approved = 0
    query += ' ORDER BY ses.session_date, ses.start_time';

    const [rows] = await pool.query(query, queryParams);

    return rows;
  },

  async remove(id) {
    await pool.query("DELETE FROM attendance_records WHERE id = ?", [id]);
  },

  // student
  async getByUser(user_id, start_date, end_date) {
    const [rows] = await pool.query(
      `
      SELECT 
        ar.*,
        u.name AS student_name,
        ses.session_date,
        ses.start_time AS session_start_time,
        ses.end_time AS session_end_time,
        ses.status AS session_status,
        ses.topic AS session_topic
      FROM attendance_records ar
      JOIN attendance_sessions ses 
        ON ar.attendance_session_id = ses.id
      JOIN students s 
        ON ar.student_id = s.id
      JOIN users u 
        ON s.user_id = u.id
      WHERE u.id = ?
        AND ses.session_date BETWEEN ? AND ?
      ORDER BY ses.session_date, ses.start_time
      `,
      [user_id, start_date, end_date]
    );
 
    return rows;
  },

  /**
   * ✅ NEW: find "current active session" for this user (student)
   * - Only session_date = today
   * - Only planned
   * - Current time within session time (allow 15 minutes early)
   */
  async getCurrentSessionByUser(user_id) {
    const [rows] = await pool.query(
      `
      SELECT
        ses.id,
        ses.schedule_id,
        ses.session_date,
        COALESCE(ses.start_time, sch.start_time) AS start_time,
        COALESCE(ses.end_time, sch.end_time)     AS end_time,
        ses.status AS session_status,
        ses.topic  AS session_topic,
        c.name     AS class_name,
        subj.name  AS subject_name,
        EXISTS (
          SELECT 1
          FROM attendance_records ar2
          WHERE ar2.attendance_session_id = ses.id
            AND ar2.student_id = st.id
          LIMIT 1
        ) AS "alreadyCheckedIn"
      FROM students st
      JOIN classes c ON c.id = st.class_id
      JOIN class_subjects cs ON cs.class_id = st.class_id
      JOIN subjects subj ON subj.id = cs.subject_id
      JOIN schedules sch ON sch.class_subject_id = cs.id
      JOIN attendance_sessions ses ON ses.schedule_id = sch.id
      WHERE st.user_id = ?
        AND ses.session_date = (NOW() AT TIME ZONE 'Asia/Phnom_Penh')::date
        AND ses.status = 'planned'
        AND (NOW() AT TIME ZONE 'Asia/Phnom_Penh')::time::interval BETWEEN
            (COALESCE(ses.start_time, sch.start_time)::interval - INTERVAL '15 minutes')
            AND COALESCE(ses.end_time, sch.end_time)::interval
      ORDER BY COALESCE(ses.start_time, sch.start_time) ASC
      LIMIT 1;

      `,
      [user_id]
    );

    if (!rows.length) {
      return { session: null, alreadyCheckedIn: false };
    }
    
    // rows[0].alreadyCheckedIn is a boolean in postgres
    const session = { ...rows[0] };
    const alreadyCheckedIn = !!session.alreadyCheckedIn;
    delete session.alreadyCheckedIn;

    return { session, alreadyCheckedIn };
  },

  async checkIn({ user_id, attendance_session_id, status, remark }) {
    // 1) Find student_id from user_id
    const [rowsStudent] = await pool.query(
      `
    SELECT s.id AS student_id
    FROM students s
    WHERE s.user_id = ?
    LIMIT 1
    `,
      [user_id]
    );

    if (!rowsStudent.length) throw new Error("Student not found for this user");
    const student_id = rowsStudent[0].student_id;

    // 2) Validate session exists + is "active now"
    // NOTE: your attendance_sessions.status enum is planned/completed/canceled :contentReference[oaicite:4]{index=4}
    const [rowsSes] = await pool.query(
      `
    SELECT
      ses.id,
      ses.session_date,
      COALESCE(ses.start_time, sch.start_time) AS start_time,
      COALESCE(ses.end_time, sch.end_time) AS end_time,
      ses.status
    FROM attendance_sessions ses
    JOIN schedules sch ON sch.id = ses.schedule_id
    WHERE ses.id = ?
      AND ses.session_date = CURRENT_DATE
      AND ses.status IN ('planned','completed')
      AND LOCALTIME::interval BETWEEN
        (COALESCE(ses.start_time, sch.start_time)::interval - INTERVAL '15 minutes')
        AND COALESCE(ses.end_time, sch.end_time)::interval
    LIMIT 1
    `,
      [attendance_session_id]
    );

    if (!rowsSes.length) {
      const err = new Error("No active session for check-in right now.");
      err.statusCode = 400;
      throw err;
    }

    // 3) Insert (or block if already checked-in)
    const [existing] = await pool.query(
      'SELECT 1 FROM attendance_records WHERE attendance_session_id = ? AND student_id = ? LIMIT 1',
      [attendance_session_id, student_id]
    );
    if (existing.length) {
      const err = new Error("You already checked in for this session.");
      err.statusCode = 409;
      throw err;
    }

    const id = await Attendance.recordAttendance({
      sessionId: attendance_session_id,
      studentId: student_id,
      status,
      remark,
      source: 'face',
      markedBy: user_id,
    });
    return this.findById(id);
  },
};
module.exports = AttendanceRecords;
