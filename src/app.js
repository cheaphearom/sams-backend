// src/app.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');

// Swagger setup
const swaggerSpec = require('./swagger');

// Middleware
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const schoolYearsRoutes = require('./routes/schoolYears.routes');
const termsRoutes = require('./routes/terms.routes');
const majorsRoutes = require('./routes/majors.routes');
const classesRoutes = require('./routes/classes.routes');
const studentsRoutes = require('./routes/students.routes');
const teachersRoutes = require('./routes/teachers.routes');
const teacherClassesRoutes = require('./routes/teacherClasses.routes');
const subjectsRoutes = require('./routes/subjects.routes');
const classSubjectsRoutes = require('./routes/classSubjects.routes');
const roomsRoutes = require('./routes/rooms.routes');
const schedulesRoutes = require('./routes/schedules.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const teacherAttendanceRoutes = require('./routes/teacherAttendance.routes');
const attendanceReportRoutes = require('./routes/attendanceReport.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const facultiesRoutes = require('./routes/faculties.routes');
const departmentsRoutes = require('./routes/departments.routes');
const attendanceSessionsRoutes = require('./routes/attendanceSessions.routes');
const takeAttendanceRoutes = require('./routes/takeAttendance.routes');
const emailRoutes = require('./routes/email.routes');
const fixAttendanceRoutes = require('./routes/fixAttendance.routes');
const reportsRoutes = require('./routes/reports.routes');
const faceRoutes = require('./routes/face.route');
const schoolsRoutes = require('./routes/schools.route');
const attendanceQrRoutes = require("./routes/attendanceQr.routes");
const teacherScheduleRoutes = require("./routes/teacherSchedule.route");

const app = express();

// Swagger documentation, registered before helmet so its CSP doesn't block the CDN files.
// The Swagger UI files come from a CDN: on Vercel, swagger-ui-express can't serve them
// from node_modules, which leaves /api/docs as a blank page
const SWAGGER_UI_CDN = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.17.14';
app.get('/api/docs.json', (req, res) => res.json(swaggerSpec));
app.get('/api/docs', (req, res) => {
  res.send(`<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>SAMS Backend API</title>
  <link rel="stylesheet" href="${SWAGGER_UI_CDN}/swagger-ui.css">
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="${SWAGGER_UI_CDN}/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({ url: '/api/docs.json', dom_id: '#swagger-ui' });
  </script>
</body>
</html>`);
});

// Global middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Static files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/school-years', schoolYearsRoutes);
app.use('/api/terms', termsRoutes);
app.use('/api/majors', majorsRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/teachers', teachersRoutes);
app.use('/api/teacher-classes', teacherClassesRoutes);
app.use('/api/subjects', subjectsRoutes);
app.use('/api/class-subjects', classSubjectsRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/schedules', schedulesRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/teacher-attendance', teacherAttendanceRoutes);
app.use('/api/attendance-report', attendanceReportRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/faculties', facultiesRoutes);
app.use('/api/departments', departmentsRoutes);
app.use('/api/attendance-sessions', attendanceSessionsRoutes);
app.use('/api/take-attendance', takeAttendanceRoutes);
app.use('/api/fix-attendance', fixAttendanceRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/face', faceRoutes);
app.use('/api/schools', schoolsRoutes);
app.use('/api/email', emailRoutes);
app.use("/api/attendance-scan", attendanceQrRoutes);
app.use("/api/teacher-schedule", teacherScheduleRoutes);

// 404 + error handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;
