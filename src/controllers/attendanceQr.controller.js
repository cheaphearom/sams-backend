const crypto = require("crypto");
const pool = require("../config/db");
const Students = require("../models/students.model");
const Teachers = require('../models/teachers.model');
const Schools = require('../models/schools.model');
const { createToken, verifyToken } = require("../utils/qrToken");
const { getDistanceInMeters } = require("../utils/distanceInMeters");
const QRCode = require('qrcode');
const { saveFile } = require('../utils/fileStore');

// Helper function to resolve teacher ID
async function resolveTeacherId(req) {
  if (req.user?.role === 'teacher') {
    const teacherId = await Teachers.getTeacherIdByUserId(req.user.id);
    return teacherId;
  }
  // Admin can pass ?teacher_id= query parameter
  if (req.user?.role === 'admin') return Number(req.query.teacher_id) || null;
  return null;
}

// TEACHER: create/rotate QR token for an existing attendance_session_id
exports.createQrForSession = async (req, res) => {
  const teacherId = await resolveTeacherId(req);
  const { attendance_session_id, ttl_seconds = 60 } = req.body;

  if (!teacherId) return res.status(401).json({ message: "Unauthorized" });
  if (!attendance_session_id) return res.status(400).json({ message: "attendance_session_id required" });

  const ttl = Math.max(15, Math.min(Number(ttl_seconds) || 60, 300)); // Set TTL between 15s and 300s

  // 1) Ensure session belongs to the teacher
  const [rows] = await pool.query(
    `SELECT cs.id, cs.class_id, cs.teacher_id
    FROM attendance_sessions as a
    JOIN schedules s on a.schedule_id = s.id
    JOIN class_subjects cs on s.class_subject_id = cs.id
    WHERE a.id = ? LIMIT 1`,
    [attendance_session_id]
  );

  if (rows.length === 0) return res.status(404).json({ message: "Attendance session not found" });

  const session = rows[0];
  if (Number(session.teacher_id) !== Number(teacherId)) {
    return res.status(403).json({ message: "You do not own this session" });
  }

  // 2) Rotate nonce + set expiry (invalidates old QR immediately)
  const nonce = crypto.randomBytes(16).toString("hex");
  const expiresAt = new Date(Date.now() + ttl * 1000);

  // Store nonce and expiration in the database
  await pool.query(
    `UPDATE attendance_sessions
     SET qr_nonce = ?, qr_expires_at = ?
     WHERE id = ?`,
    [nonce, expiresAt, attendance_session_id]
  );

  // 3) Create signed token
  const token = createToken({
    sid: attendance_session_id,
    nonce,
    exp: expiresAt.getTime(),
  });

  // 4) Generate QR code image and store it in the database (Vercel can't write files)
  const qrImageName = `qr_${attendance_session_id}.png`;

  try {
    const qrBuffer = await QRCode.toBuffer(token);
    await saveFile(`qrcodes/${qrImageName}`, qrBuffer, "image/png");

    // 5) Return the URL of the generated QR code image
    const qrImageUrl = `/uploads/qrcodes/${qrImageName}`;

    return res.json({
      success: true,
      attendance_session_id,
      class_id: session.class_id,
      expires_at: expiresAt.toISOString(),
      qr_token: token,
      qr_image_url: qrImageUrl, // Include the URL in the response
    });
  } catch (error) {
    return res.status(500).json({ message: "Error generating QR code", error: error.message });
  }
};

// STUDENT: scan QR and check-in as PRESENT
exports.checkInByQr = async (req, res) => {
  const userId = req.user?.id; // Logged-in student user ID
  const { qr_token, latitude, longitude } = req.body;
  if (!latitude || !longitude) {
    return res.status(400).json({ message: "Location required for check-in" });
  }
  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (!qr_token) return res.status(400).json({ message: "qr_token required" });

  // 1) Decode/verify token signature + expiration
  let decoded;
  try {
    decoded = verifyToken(qr_token); // Validate the token
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }

  const { sid, nonce } = decoded;

  // 2) Load student and session details
  const student = await Students.findByUserId(userId);
  if (!student) return res.status(404).json({ message: "Student not found" });
  
  const [sessRows] = await pool.query(
    ` SELECT asd.id, cs.class_id, asd.qr_nonce, asd.qr_expires_at
      FROM attendance_sessions asd
      JOIN schedules s on asd.schedule_id = s.id
      JOIN class_subjects cs on s.class_subject_id = cs.id
      WHERE asd.id = ?
      LIMIT 1`,
    [sid]
  );
  
  if (sessRows.length === 0) return res.status(404).json({ message: "Session not found" });

  const session = sessRows[0];

  // 3) Validate nonce matches current session QR + check expiry
  if (!session.qr_nonce || session.qr_nonce !== nonce) {
    return res.status(400).json({ message: "QR code is no longer valid. Ask teacher to refresh." });
  }

  const dbExpiry = session.qr_expires_at ? new Date(session.qr_expires_at).getTime() : 0;
  if (!dbExpiry || Date.now() > dbExpiry) {
    return res.status(400).json({ message: "QR code expired. Ask teacher to refresh." });
  }

  const school = await Schools.findById(1);
  if (!school) {
    return res.status(404).json({ message: "School not found" });
  }

  const schoolLat = parseFloat(school.latitude);
  const schoolLng = parseFloat(school.longitude);

  const userLat = parseFloat(latitude);
  const userLng = parseFloat(longitude);

  const distance = getDistanceInMeters(
    userLat,
    userLng,
    schoolLat,
    schoolLng
  );

  if (distance > 200) {
    return res.status(403).json({
      message: "You are not within school area",
      distance: `${distance.toFixed(2)} meters`
    });
  }

  // 4) Ensure student belongs to this class
  if (Number(student.class_id) !== Number(session.class_id)) {
    return res.status(403).json({ message: "You are not in this class" });
  }

  // 5) Insert attendance (unique prevents duplicates)
  await pool.query(
    `INSERT INTO attendance_checkins (attendance_session_id, student_id, status, method)
     VALUES (?, ?, 'PRESENT', 'QR')
     ON CONFLICT (attendance_session_id, student_id) DO UPDATE SET status='PRESENT', checked_in_at=NOW(), method='QR'`,
    [sid, student.id] // student.id = students table PK
  );
  // 6. Insert new attendance
  await pool.query(
      `
      INSERT INTO attendance_records 
        (attendance_session_id, student_id, take_by, status, remark, reason, approved)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [sid, student.id, student.id, "present", "scan QR", "attendance_records", 1]
    );
  return res.json({
    success: true,
    message: "Checked in successfully",
    attendance_session_id: sid,
    student_id: student.id,
    class_id: session.class_id,
  });
};
