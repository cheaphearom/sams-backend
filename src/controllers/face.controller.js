// controllers/face.controller.js
const jwt = require("jsonwebtoken");
const Students = require("../models/students.model");
const pool = require("../config/db");

const { extractDescriptorFromBase64, distance } = require("../services/face.service");

function normalizeDescriptor(value) {
  // JSON column can come as array/object OR string depending on driver config
  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  // sometimes it may come as an object (rare for your case)
  return null;
}

async function logFaceResult(userId, attendance_session_id, score, result) {
  await pool.query(
    `INSERT INTO face_verification_logs (user_id, attendance_session_id, score, result)
     VALUES (?, ?, ?, ?)`,
    [userId, attendance_session_id, score, result]
  );
}

exports.verifyOrEnroll = async (req, res) => {
  const userId = req.user?.id;
  const { imageBase64, attendance_session_id } = req.body;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (!imageBase64) return res.status(400).json({ message: "imageBase64 required" });
  if (!attendance_session_id) return res.status(400).json({ message: "attendance_session_id required" });

  try {
    const student = await Students.findByUserId(userId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // 1) extract descriptor (stub may return dummy array; otherwise null)
    let liveDesc;
    try {
      liveDesc = await extractDescriptorFromBase64(imageBase64);
    } catch (err) {
      await logFaceResult(userId, attendance_session_id, null, "fail");
      return res.status(400).json({ message: err.message || "Invalid image data" });
    }

    // 2) if null => treat as "no face"
    if (!liveDesc) {
      await logFaceResult(userId, attendance_session_id, null, "fail");
      return res.status(400).json({ message: "No face detected. Try again." });
    }

    // 3) enroll if no stored descriptor
    if (!student.face_descriptor) {
      // store JSON array into JSON column
      await Students.updateFaceDescriptorByUserId(userId, JSON.stringify(liveDesc));

      const [logRes] = await pool.query(
        `INSERT INTO face_verification_logs (user_id, attendance_session_id, score, result)
         VALUES (?, ?, 0, 'success')`,
        [userId, attendance_session_id]
      );

      const faceToken = jwt.sign(
        { type: "face", userId, attendance_session_id, logId: logRes.insertId },
        process.env.JWT_SECRET,
        { expiresIn: "60s" }
      );

      return res.json({
        enrolled: true,
        score: 0,
        faceToken,
        message: "Enrolled (descriptor saved).",
      });
    }

    // 4) verify if stored exists
    const storedDesc = normalizeDescriptor(student.face_descriptor);
    if (!Array.isArray(storedDesc)) {
      await logFaceResult(userId, attendance_session_id, null, "fail");
      return res
        .status(400)
        .json({ message: "Stored face data is invalid. Please re-enroll or use QR." });
    }

    const dist = distance(storedDesc, liveDesc);

    // NOTE: In stub mode dist will be 0 if both are [0..0]
    const threshold = 0.55;
    const ok = dist <= threshold;

    const [logRes] = await pool.query(
      `INSERT INTO face_verification_logs (user_id, attendance_session_id, score, result)
       VALUES (?, ?, ?, ?)`,
      [userId, attendance_session_id, dist, ok ? "success" : "fail"]
    );

    if (!ok) return res.status(401).json({ message: "Not matched", score: dist });

    const faceToken = jwt.sign(
      { type: "face", userId, attendance_session_id, logId: logRes.insertId },
      process.env.JWT_SECRET,
      { expiresIn: "60s" }
    );

    return res.json({ enrolled: false, score: dist, faceToken });
  } catch (err) {
    try {
      await logFaceResult(userId, attendance_session_id, null, "fail");
    } catch (_) {}

    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
