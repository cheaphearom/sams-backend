const Teachers = require('../models/teachersSides.model');

// Get all classes assigned to the teacher
exports.getClassesByTeacher = async (req, res, next) => {
  try {
    const classes = await Teachers.getClassesByTeacherId(req.params.id);
    res.json(classes);
  } catch (err) {
    next(err);
  }
};

// Get all students in a teacher's class
exports.getStudentsByClass = async (req, res, next) => {
  try {
    const students = await Teachers.getStudentsByClass(req.params.classId);
    res.json(students);
  } catch (err) {
    next(err);
  }
};

// Take attendance for a class session
exports.takeAttendance = async (req, res, next) => {
  try {
    const { sessionId, studentId, status, remark } = req.body;
    const attendance = await Teachers.takeAttendance(sessionId, studentId, status, remark);
    res.status(201).json(attendance);
  } catch (err) {
    next(err);
  }
};

// Get attendance history for a teacher
exports.getAttendanceHistory = async (req, res, next) => {
  try {
    const history = await Teachers.getAttendanceHistory(req.params.id);
    res.json(history);
  } catch (err) {
    next(err);
  }
};

// Get teacher's own attendance records
exports.getTeacherAttendance = async (req, res, next) => {
  try {
    const attendance = await Teachers.getTeacherAttendance(req.params.id);
    res.json(attendance);
  } catch (err) {
    next(err);
  }
};

// Get teacher's timetable
exports.getTeacherTimetable = async (req, res, next) => {
  try {
    const timetable = await Teachers.getTeacherTimetable(req.params.id);
    res.json(timetable);
  } catch (err) {
    next(err);
  }
};

// Get upcoming sessions for a teacher
exports.getUpcomingSessions = async (req, res, next) => {
  try {
    const sessions = await Teachers.getUpcomingSessions(req.params.id);
    res.json(sessions);
  } catch (err) {
    next(err);
  }
};

// Generate attendance report for a teacher
exports.getAttendanceReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const report = await Teachers.getAttendanceReport(req.params.id, startDate, endDate);
    res.json(report);
  } catch (err) {
    next(err);
  }
};
