// The one place that creates attendance sessions and writes attendance records.
// Every screen (teacher sheet, take / fix attendance, QR scan, face check-in,
// student leave requests, approvals) goes through these functions, so the rules
// are the same everywhere:
//   - one record per student per session: existing records are updated,
//     never deleted and re-inserted (that used to wipe QR scans and requests)
//   - every record says how it was made (source) and by whom (marked_by)
const pool = require('../config/db');

const STATUSES = ['present', 'absent', 'late'];
const SOURCES = ['teacher', 'admin', 'qr', 'face', 'request'];

function badRequest(message) {
  const err = new Error(message);
  err.status = 400;
  return err;
}

function normalizeStatus(status) {
  const s = String(status || '').toLowerCase();
  if (!STATUSES.includes(s)) throw badRequest(`Status must be one of: ${STATUSES.join(', ')}`);
  return s;
}

// Returns the id of the session for this schedule and date, creating it if needed.
// With overwrite, the given times / status / topic replace the stored ones.
async function getOrCreateSession(
  { schedule_id, session_date, start_time, end_time, status, topic },
  { overwrite = false, db = pool } = {}
) {
  if (!schedule_id || !session_date) throw badRequest('schedule_id and session_date are required');

  const onConflict = overwrite
    ? `start_time = EXCLUDED.start_time, end_time = EXCLUDED.end_time,
       status = EXCLUDED.status, topic = EXCLUDED.topic, updated_at = NOW()`
    : 'updated_at = NOW()';

  const [result] = await db.query(
    `INSERT INTO attendance_sessions
       (schedule_id, session_date, start_time, end_time, status, topic, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
     ON CONFLICT (schedule_id, session_date) DO UPDATE SET ${onConflict}`,
    [schedule_id, session_date, start_time || null, end_time || null, status || 'planned', topic || null]
  );
  return result.insertId;
}

// Creates or updates one student's record in a session. Returns the record id.
//   source:    who/what marked it (see SOURCES)
//   markedBy:  users.id of the person who marked it
//   approved:  teacher/admin/qr/face records count straight away; requests start pending
async function recordAttendance(
  { sessionId, studentId, status, remark = '', reason, source, markedBy = null, approved },
  { db = pool } = {}
) {
  if (!SOURCES.includes(source)) throw new Error(`Unknown attendance source: ${source}`);
  const st = normalizeStatus(status);
  const isApproved = approved ?? (source === 'request' ? 0 : 1);
  const why = reason || (source === 'request' ? 'other' : 'attendance_records');

  const update = async () => {
    const [res] = await db.query(
      `UPDATE attendance_records
       SET status = ?, remark = ?, reason = ?, source = ?, marked_by = ?, take_by = ?,
           approved = ?, approved_by = ?, updated_at = NOW()
       WHERE attendance_session_id = ? AND student_id = ?`,
      [st, remark ?? '', why, source, markedBy, markedBy || 0,
       isApproved ? 1 : 0, isApproved ? markedBy || 0 : 0, sessionId, studentId]
    );
    return res.affectedRows > 0;
  };

  if (!(await update())) {
    // Inside a transaction a failed statement aborts everything, so guard the insert
    const inTransaction = db !== pool;
    if (inTransaction) await db.query('SAVEPOINT record_insert');
    try {
      await db.query(
        `INSERT INTO attendance_records
           (attendance_session_id, student_id, status, remark, reason, source, marked_by,
            take_by, approved, approved_by, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [sessionId, studentId, st, remark ?? '', why, source, markedBy, markedBy || 0,
         isApproved ? 1 : 0, isApproved ? markedBy || 0 : 0]
      );
    } catch (err) {
      // Another request created the record a moment ago: update that one instead
      if (err.code !== '23505') throw err;
      if (inTransaction) await db.query('ROLLBACK TO SAVEPOINT record_insert');
      await update();
    }
  }

  const [rows] = await db.query(
    'SELECT id FROM attendance_records WHERE attendance_session_id = ? AND student_id = ?',
    [sessionId, studentId]
  );
  return rows[0]?.id ?? null;
}

// Saves a whole attendance sheet ([{ student_id, status, remark }]) in one transaction.
// Students not in the list keep whatever record they already have.
async function saveSheet(sessionId, records, { source, markedBy, completeSession = false }) {
  if (!Array.isArray(records)) throw badRequest('records must be an array');
  records.forEach((r) => normalizeStatus(r.status)); // reject bad input before writing anything

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    for (const r of records) {
      await recordAttendance(
        { sessionId, studentId: r.student_id, status: r.status, remark: r.remark || '', source, markedBy },
        { db: conn }
      );
    }
    if (completeSession) {
      await conn.query(
        `UPDATE attendance_sessions SET status = 'completed', updated_at = NOW() WHERE id = ?`,
        [sessionId]
      );
    }
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

// Approves (or un-approves) a record. Who marked it stays as it was.
async function setApproval(recordId, approved, approvedByUserId) {
  const [res] = await pool.query(
    `UPDATE attendance_records
     SET approved = ?, approved_by = ?, updated_at = NOW()
     WHERE id = ?`,
    [approved ? 1 : 0, approved ? approvedByUserId : 0, recordId]
  );
  return res.affectedRows > 0;
}

module.exports = {
  STATUSES,
  SOURCES,
  getOrCreateSession,
  recordAttendance,
  saveSheet,
  setApproval,
};
