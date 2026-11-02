const pool = require('../config/db');

const Dashboard = {
  async getDashboardData() {
    // Summary counters
    const [[students]] = await pool.query(
      `SELECT COUNT(*) AS total_students FROM students`
    );
    const [[teachers]] = await pool.query(
      `SELECT COUNT(*) AS total_teachers FROM teachers`
    );
    const [[classes]] = await pool.query(
      `SELECT COUNT(*) AS total_classes FROM classes`
    );
    const [[subjects]] = await pool.query(
      `SELECT COUNT(*) AS total_subjects FROM subjects`
    );

    // Today's attendance summary
    const [[today]] = await pool.query(
      `
      SELECT
        SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) AS present_count,
        SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END)  AS absent_count,
        SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END)    AS late_count,
        SUM(CASE WHEN status = 'excused' THEN 1 ELSE 0 END) AS excused_count
      FROM attendance_records
      WHERE DATE(created_at) = CURRENT_DATE
      `
    );

    // Last 7-day trend
    const [weeklyTrend] = await pool.query(
      `
      SELECT
        DATE(created_at) AS date,
        SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) AS present_count,
        SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END)  AS absent_count
      FROM attendance_records
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
      `
    );

    // Top 5 absentees
    const [topAbsentees] = await pool.query(
      `
      SELECT
        s.id,
        s.first_name,
        s.last_name,
        COUNT(ar.id) AS absent_count
      FROM attendance_records ar
      JOIN students s ON s.id = ar.student_id
      WHERE ar.status = 'absent'
      GROUP BY s.id
      ORDER BY absent_count DESC
      LIMIT 5
      `
    );

    // Class attendance performance
    const [classPerformance] = await pool.query(
      `
      SELECT
        c.id,
        c.name AS class_name,
        SUM(CASE WHEN ar.status = 'present' THEN 1 ELSE 0 END) AS present_count,
        SUM(CASE WHEN ar.status = 'absent' THEN 1 ELSE 0 END)  AS absent_count
      FROM attendance_records ar
      JOIN students s ON ar.student_id = s.id
      JOIN classes c ON s.class_id = c.id
      GROUP BY c.id
      `
    );

    // Recent attendance activity
    const [recentActivity] = await pool.query(
      `
      SELECT
        ar.id,
        ar.status,
        ar.created_at,
        s.first_name,
        s.last_name
      FROM attendance_records ar
      JOIN students s ON ar.student_id = s.id
      JOIN users u ON s.user_id = u.id
      ORDER BY ar.created_at DESC
      LIMIT 10
      `
    );

    return {
      counters: {
        students: students.total_students,
        teachers: teachers.total_teachers,
        classes: classes.total_classes,
        subjects: subjects.total_subjects,
      },
      todayAttendance: today,
      weeklyTrend,
      topAbsentees,
      classPerformance,
      recentActivity,
    };
  },
  async getDashboardDataStudent(user_id) {
      // 1) Find the student by user_id
      const [[student]] = await pool.query(
        `SELECT id, class_id FROM students WHERE user_id = ? LIMIT 1`,
        [user_id]
      );      
      if (!student) {
        throw new Error("Student profile not found for this user.");
      }

      const studentId = student.id;
      const classId = student.class_id;

      // 2) Summary counters (scoped to the student's class)
      const [[students]] = await pool.query(
        `SELECT COUNT(*) AS total_students FROM students WHERE class_id = ?`,
        [classId]
      );

      // Count teachers who teach this class via schedules
      // (Assumes: schedules.teacher_id exists and schedules.class_subject_id -> class_subjects.id)
      const [[teachers]] = await pool.query(
        `
        SELECT COUNT(DISTINCT cs.teacher_id) AS total_teachers
        FROM schedules sch
        JOIN class_subjects cs ON sch.class_subject_id = cs.id
        WHERE cs.class_id = ?
        `,
        [classId]
      );

      const [[classes]] = await pool.query(
        `SELECT 1 AS total_classes`
      );

      // Count subjects assigned to this class via class_subjects
      const [[subjects]] = await pool.query(
        `
        SELECT COUNT(DISTINCT cs.subject_id) AS total_subjects
        FROM class_subjects cs
        WHERE cs.class_id = ?
        `,
        [classId]
      );

      // 3) Today's attendance summary (ONLY this student)
      const [[today]] = await pool.query(
        `
        SELECT
          COALESCE(SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END), 0) AS present_count,
          COALESCE(SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END), 0)  AS absent_count,
          COALESCE(SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END), 0)    AS late_count,
          COALESCE(SUM(CASE WHEN status = 'excused' THEN 1 ELSE 0 END), 0) AS excused_count
        FROM attendance_records
        WHERE student_id = ?
          AND DATE(created_at) = CURRENT_DATE
        `,
        [studentId]
      );

      // 4) Last 7-day trend (ONLY this student)
      const [weeklyTrend] = await pool.query(
        `
        SELECT
          DATE(created_at) AS date,
          COALESCE(SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END), 0) AS present_count,
          COALESCE(SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END), 0)  AS absent_count,
          COALESCE(SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END), 0)    AS late_count,
          COALESCE(SUM(CASE WHEN status = 'excused' THEN 1 ELSE 0 END), 0) AS excused_count
        FROM attendance_records
        WHERE student_id = ?
          AND created_at >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY DATE(created_at)
        ORDER BY date ASC
        `,
        [studentId]
      );

      // 5) Top 5 absentees (in the SAME class, last 30 days)
      const [topAbsentees] = await pool.query(
        `
        SELECT
          s.id,
          s.first_name,
          s.last_name,
          COUNT(ar.id) AS absent_count
        FROM attendance_records ar
        JOIN students s ON s.id = ar.student_id
        WHERE s.class_id = ?
          AND ar.status = 'absent'
          AND ar.created_at >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY s.id
        ORDER BY absent_count DESC
        LIMIT 5
        `,
        [classId]
      );

      // 6) Class attendance performance (ONLY this student's class)
      const [classPerformance] = await pool.query(
        `
        SELECT
          c.id,
          c.name AS class_name,
          COALESCE(SUM(CASE WHEN ar.status = 'present' THEN 1 ELSE 0 END), 0) AS present_count,
          COALESCE(SUM(CASE WHEN ar.status = 'absent' THEN 1 ELSE 0 END), 0)  AS absent_count,
          COALESCE(SUM(CASE WHEN ar.status = 'late' THEN 1 ELSE 0 END), 0)    AS late_count,
          COALESCE(SUM(CASE WHEN ar.status = 'excused' THEN 1 ELSE 0 END), 0) AS excused_count
        FROM attendance_records ar
        JOIN students s ON ar.student_id = s.id
        JOIN classes c ON s.class_id = c.id
        WHERE c.id = ?
        GROUP BY c.id
        `,
        [classId]
      );

      // 7) Recent attendance activity (ONLY this student)
      const [recentActivity] = await pool.query(
        `
        SELECT
          ar.id,
          ar.status,
          ar.created_at
        FROM attendance_records ar
        WHERE ar.student_id = ?
        ORDER BY ar.created_at DESC
        LIMIT 10
        `,
        [studentId]
      );

      return {
        counters: {
          students: students.total_students,
          teachers: teachers.total_teachers,
          classes: classes.total_classes,   // always 1 for student dashboard
          subjects: subjects.total_subjects,
        },
        todayAttendance: today,
        weeklyTrend,
        topAbsentees,
        classPerformance,
        recentActivity,
      };
  },
};

module.exports = Dashboard;
