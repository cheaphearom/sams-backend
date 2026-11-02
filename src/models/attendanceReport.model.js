// models/attendanceReport.model.js
const db = require('../config/db'); // change path to your db connection

/**
 * Get attendance summary for one schedule.
 * Returns one row per student in that schedule.
 */
async function getSummaryBySchedule(scheduleId) {
  const [rows] = await db.query(
    `
    SELECT 
      s.id AS student_id,
      u.name AS student_name,
      SUM(CASE WHEN ar.status = 'present' THEN 1 ELSE 0 END) AS present_count,
      SUM(CASE WHEN ar.status = 'absent' THEN 1 ELSE 0 END) AS absent_count,
      SUM(CASE WHEN ar.status = 'late' THEN 1 ELSE 0 END) AS late_count
    FROM schedules sch
    JOIN class_subjects cs ON cs.id = sch.class_subject_id
    JOIN classes c ON c.id = cs.class_id
    JOIN students s ON s.class_id = c.id
    JOIN users u ON u.id = s.user_id
    LEFT JOIN attendance_records ar 
      ON ar.student_id = s.id
      AND ar.schedule_id = sch.id
    WHERE sch.id = ?
    GROUP BY s.id, u.name
    ORDER BY u.name
    `,
    [scheduleId]
  );

  return rows;
}

module.exports = {
  getSummaryBySchedule,
};
