-- Record how and by whom each attendance record was made, instead of guessing
-- it from approved / reason / take_by.
--   source:    teacher | admin | qr | face | request (a student's leave request)
--   marked_by: the users.id who marked it (the student for qr, face and request)

ALTER TABLE attendance_records ADD COLUMN IF NOT EXISTS source VARCHAR(20) NOT NULL DEFAULT 'teacher';
ALTER TABLE attendance_records ADD COLUMN IF NOT EXISTS marked_by BIGINT;

-- Fill in existing rows from the clues the old code left
UPDATE attendance_records SET source = 'qr' WHERE remark = 'scan QR';
UPDATE attendance_records SET source = 'face' WHERE remark LIKE 'Self check-in%';
UPDATE attendance_records SET source = 'request'
  WHERE source = 'teacher' AND reason IS NOT NULL AND reason <> 'attendance_records';

-- QR, face and requests were made by the student themselves
UPDATE attendance_records ar SET marked_by = s.user_id
  FROM students s
  WHERE ar.student_id = s.id AND ar.source IN ('qr', 'face', 'request') AND ar.marked_by IS NULL;

ALTER TABLE attendance_records
  ADD CONSTRAINT attendance_records_source_check
  CHECK (source IN ('teacher', 'admin', 'qr', 'face', 'request'));

ALTER TABLE attendance_records
  ADD CONSTRAINT fk_attendance_records_marked_by
  FOREIGN KEY (marked_by) REFERENCES users (id) ON DELETE SET NULL;
