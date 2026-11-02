const pool = require('../config/db');

const TeachersSides = {
  // Get all classes assigned to the teacher
  async getClassesByTeacherId(teacherId) {
    const [rows] = await pool.query(
      `SELECT c.name AS class_name, cs.subject_id, cs.teacher_id
       FROM teacher_classes tc
       JOIN classes c ON tc.class_id = c.id
       JOIN class_subjects cs ON cs.class_id = c.id
       WHERE tc.teacher_id = ?`,
      [teacherId]
    );
    return rows;
  },

  // Get all students in a teacher's class
  async getStudentsByClass(classId) {
    const [rows] = await pool.query(
      `SELECT s.first_name, s.last_name, s.student_code, s.status
       FROM students s
       WHERE s.class_id = ?`,
      [classId]
    );
    return rows;
  },

  // Take attendance for a session
  async takeAttendance(sessionId, studentId, status, remark) {
    const [result] = await pool.query(
      `INSERT INTO attendance_records (attendance_session_id, student_id, status, remark, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [sessionId, studentId, status, remark]
    );
    return result;
  },

  // Get attendance history for a teacher
  async getAttendanceHistory(teacherId) {
    const [rows] = await pool.query(
      `SELECT ta.*, a.session_date, a.status AS attendance_status
       FROM teacher_attendance ta
       JOIN attendance_sessions a ON ta.attendance_session_id = a.id
       WHERE ta.teacher_id = ?`,
      [teacherId]
    );
    return rows;
  },

  // Get teacher's own attendance records
  async getTeacherAttendance(teacherId) {
    const [rows] = await pool.query(
      `SELECT ta.*, a.session_date, a.status AS attendance_status
       FROM teacher_attendance ta
       JOIN attendance_sessions a ON ta.attendance_session_id = a.id
       WHERE ta.teacher_id = ?`,
      [teacherId]
    );
    return rows;
  },

  // Get the teacher's timetable (weekly view)
  async getTeacherTimetable(teacherId) {
    const [rows] = await pool.query(
      `SELECT s.*, r.name AS room_name
       FROM schedules s
       JOIN rooms r ON s.room_id = r.id
       JOIN teacher_classes tc ON tc.class_id = s.class_id
       WHERE tc.teacher_id = ?`,
      [teacherId]
    );
    return rows;
  },

  // Get upcoming sessions for a teacher
  async getUpcomingSessions(teacherId) {
    const [rows] = await pool.query(
      `SELECT a.session_date, a.start_time, a.end_time, a.topic
       FROM attendance_sessions a
       JOIN schedules s ON s.id = a.schedule_id
       WHERE s.teacher_id = ? AND a.status = 'planned'`,
      [teacherId]
    );
    return rows;
  },

  // Generate attendance report for a teacher
  async getAttendanceReport(teacherId, startDate, endDate) {
    const [rows] = await pool.query(
      `SELECT ta.*, a.session_date, a.status AS attendance_status
       FROM teacher_attendance ta
       JOIN attendance_sessions a ON ta.attendance_session_id = a.id
       WHERE ta.teacher_id = ? AND a.session_date BETWEEN ? AND ?`,
      [teacherId, startDate, endDate]
    );
    return rows;
  }
};

module.exports = TeachersSides;
