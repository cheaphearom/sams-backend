-- One attendance record per student per session.
-- Safe to run more than once.

-- 1) Remove duplicates, keeping per (session, student) the approved record
--    first, then the most recently updated, then the newest
DELETE FROM attendance_records ar
USING (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY attendance_session_id, student_id
           ORDER BY approved DESC, updated_at DESC, id DESC
         ) AS rn
  FROM attendance_records
) ranked
WHERE ar.id = ranked.id
  AND ranked.rn > 1;

-- 2) Stop new duplicates
CREATE UNIQUE INDEX IF NOT EXISTS uq_attendance_records_session_student
  ON attendance_records (attendance_session_id, student_id);
