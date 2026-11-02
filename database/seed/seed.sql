-- =====================================================================
-- SAMS demo data
--
-- ⚠️  STEP 1 DELETES ALL DATA in every table (users, attendance, uploaded
--     images...). Only the table structure and schema_migrations are kept.
--
-- Run it with:  npm run db:reset -- --yes   (also applies pending migrations first)
-- or paste this whole file into the Neon SQL Editor. In that case the
-- migrations must already be applied: open the API once after deploying.
--
-- Every account's password:  Sams@2026
--   admin@sams.demo                     admin
--   dara.sok@sams.demo, ...             teachers (see below)
--   pisey.chea@sams.demo, ...           students (see below)
--
-- Attendance history is generated for every lesson before today, so the
-- dates follow the day you run it. Term 1 runs 2026-10-01 to 2027-01-31.
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- 1) Clear all data (keeps schema_migrations, resets every id to 1)
-- ---------------------------------------------------------------------
DO $$
DECLARE tables text;
BEGIN
  SELECT string_agg(format('%I', tablename), ', ')
    INTO tables
    FROM pg_tables
   WHERE schemaname = 'public' AND tablename <> 'schema_migrations';
  EXECUTE 'TRUNCATE ' || tables || ' RESTART IDENTITY CASCADE';
END $$;

-- ---------------------------------------------------------------------
-- 2) School, faculties, departments, majors
-- ---------------------------------------------------------------------
-- id 1 is the school the app shows in the header and uses for the QR
-- check-in location (200 m radius). Change the location in Settings.
INSERT INTO schools (id, name, address, latitude, longitude) VALUES
  (1, 'SAMS Demo Institute', 'Phnom Penh, Cambodia', 11.5564000, 104.9282000);

INSERT INTO faculties (id, name, code) VALUES
  (1, 'Faculty of Engineering', 'ENG'),
  (2, 'Faculty of Business', 'BUS');

INSERT INTO departments (id, faculty_id, name, code) VALUES
  (1, 1, 'Department of Computer Science', 'CS'),
  (2, 2, 'Department of Accounting and Finance', 'AF');

INSERT INTO majors (id, name, code, department_id, created_at, updated_at) VALUES
  (1, 'Software Engineering', 'SE', 1, NOW(), NOW()),
  (2, 'Accounting', 'ACC', 2, NOW(), NOW());

-- ---------------------------------------------------------------------
-- 3) Academic year, terms, classes, rooms, subjects
-- ---------------------------------------------------------------------
INSERT INTO school_years (id, name, start_date, end_date, created_at, updated_at) VALUES
  (1, '2026-2027', '2026-10-01', '2027-07-31', NOW(), NOW());

INSERT INTO terms (id, school_year_id, name, start_date, end_date, created_at, updated_at) VALUES
  (1, 1, 'Term 1', '2026-10-01', '2027-01-31', NOW(), NOW()),
  (2, 1, 'Term 2', '2027-02-15', '2027-07-31', NOW(), NOW());

INSERT INTO classes (id, name, grade_level, major_id, school_year_id, term_id, created_at, updated_at) VALUES
  (1, 'SE Year 1 - A', 1, 1, 1, 1, NOW(), NOW()),
  (2, 'SE Year 1 - B', 1, 1, 1, 1, NOW(), NOW()),
  (3, 'ACC Year 1 - A', 1, 2, 1, 1, NOW(), NOW());

INSERT INTO rooms (id, name, capacity, created_at, updated_at) VALUES
  (1, 'A101', 40, NOW(), NOW()),
  (2, 'A102', 40, NOW(), NOW()),
  (3, 'Lab B201', 30, NOW(), NOW()),
  (4, 'Lab B202', 30, NOW(), NOW()),
  (5, 'Hall C1', 120, NOW(), NOW());

INSERT INTO subjects (id, code, name, credit, created_at, updated_at) VALUES
  (1, 'SE101', 'Programming Fundamentals', 3, NOW(), NOW()),
  (2, 'SE102', 'Web Development', 3, NOW(), NOW()),
  (3, 'SE103', 'Database Systems', 3, NOW(), NOW()),
  (4, 'GE101', 'English for IT', 2, NOW(), NOW()),
  (5, 'ACC101', 'Principles of Accounting', 3, NOW(), NOW()),
  (6, 'BUS101', 'Business Mathematics', 3, NOW(), NOW()),
  (7, 'GE102', 'English for Business', 2, NOW(), NOW());

-- ---------------------------------------------------------------------
-- 4) Users: 1 admin, 4 teachers, 18 students (password Sams@2026)
-- ---------------------------------------------------------------------
INSERT INTO users (id, name, email, first_name, last_name, password_hash, role, created_at, updated_at)
SELECT id, first_name || ' ' || last_name, email, first_name, last_name,
       '$2a$10$/XuK6nYhd.hhBsRI8oHOk./UnEkJnY508HO5Wk0b5pHuKSLKphP5C', role, NOW(), NOW()
FROM (VALUES
  ( 1, 'System', 'Admin',     'admin@sams.demo',          'admin'),
  ( 2, 'Sok',    'Dara',      'dara.sok@sams.demo',       'teacher'),
  ( 3, 'Chan',   'Sophea',    'sophea.chan@sams.demo',    'teacher'),
  ( 4, 'Lim',    'Vannak',    'vannak.lim@sams.demo',     'teacher'),
  ( 5, 'Keo',    'Sreymom',   'sreymom.keo@sams.demo',    'teacher'),
  -- SE Year 1 - A
  ( 6, 'Chea',   'Pisey',     'pisey.chea@sams.demo',     'student'),
  ( 7, 'Heng',   'Rithy',     'rithy.heng@sams.demo',     'student'),
  ( 8, 'Ly',     'Sokha',     'sokha.ly@sams.demo',       'student'),
  ( 9, 'Meas',   'Vuthy',     'vuthy.meas@sams.demo',     'student'),
  (10, 'Noun',   'Chanthy',   'chanthy.noun@sams.demo',   'student'),
  (11, 'Pen',    'Dalin',     'dalin.pen@sams.demo',      'student'),
  -- SE Year 1 - B
  (12, 'Phan',   'Kosal',     'kosal.phan@sams.demo',     'student'),
  (13, 'Ros',    'Bopha',     'bopha.ros@sams.demo',      'student'),
  (14, 'Sam',    'Nimol',     'nimol.sam@sams.demo',      'student'),
  (15, 'Tep',    'Sovann',    'sovann.tep@sams.demo',     'student'),
  (16, 'Ung',    'Leakhena',  'leakhena.ung@sams.demo',   'student'),
  (17, 'Yim',    'Rotha',     'rotha.yim@sams.demo',      'student'),
  -- ACC Year 1 - A
  (18, 'Bun',    'Sreyneang', 'sreyneang.bun@sams.demo',  'student'),
  (19, 'Chhim',  'Visal',     'visal.chhim@sams.demo',    'student'),
  (20, 'Hun',    'Malis',     'malis.hun@sams.demo',      'student'),
  (21, 'Kim',    'Sambath',   'sambath.kim@sams.demo',    'student'),
  (22, 'Mao',    'Sopheak',   'sopheak.mao@sams.demo',    'student'),
  (23, 'Nhem',   'Raksmey',   'raksmey.nhem@sams.demo',   'student')
) AS u(id, first_name, last_name, email, role);

INSERT INTO teachers (id, user_id, first_name, last_name, employee_code, status, created_at, updated_at)
SELECT u.id - 1, u.id, u.first_name, u.last_name, 'T-00' || (u.id - 1), 'active', NOW(), NOW()
FROM users u WHERE u.role = 'teacher';
-- teachers: 1 Sok Dara, 2 Chan Sophea, 3 Lim Vannak, 4 Keo Sreymom

-- 6 students per class, codes S26-0001 ... S26-0018
INSERT INTO students (id, user_id, first_name, last_name, student_code, class_id, status, created_at, updated_at)
SELECT u.id - 5, u.id, u.first_name, u.last_name,
       'S26-' || lpad((u.id - 5)::text, 4, '0'),
       ((u.id - 6) / 6) + 1, 'active', NOW(), NOW()
FROM users u WHERE u.role = 'student';

-- ---------------------------------------------------------------------
-- 5) Who teaches what, homeroom teachers, weekly timetable
-- ---------------------------------------------------------------------
INSERT INTO class_subjects (id, class_id, subject_id, teacher_id, created_at, updated_at) VALUES
  ( 1, 1, 1, 1, NOW(), NOW()),  -- SE A  · Programming Fundamentals · Sok Dara
  ( 2, 1, 2, 1, NOW(), NOW()),  -- SE A  · Web Development          · Sok Dara
  ( 3, 1, 3, 2, NOW(), NOW()),  -- SE A  · Database Systems         · Chan Sophea
  ( 4, 1, 4, 3, NOW(), NOW()),  -- SE A  · English for IT           · Lim Vannak
  ( 5, 2, 1, 1, NOW(), NOW()),  -- SE B  · Programming Fundamentals · Sok Dara
  ( 6, 2, 2, 1, NOW(), NOW()),  -- SE B  · Web Development          · Sok Dara
  ( 7, 2, 3, 2, NOW(), NOW()),  -- SE B  · Database Systems         · Chan Sophea
  ( 8, 2, 4, 3, NOW(), NOW()),  -- SE B  · English for IT           · Lim Vannak
  ( 9, 3, 5, 4, NOW(), NOW()),  -- ACC A · Principles of Accounting · Keo Sreymom
  (10, 3, 6, 4, NOW(), NOW()),  -- ACC A · Business Mathematics     · Keo Sreymom
  (11, 3, 7, 3, NOW(), NOW());  -- ACC A · English for Business     · Lim Vannak

INSERT INTO teacher_classes (teacher_id, class_id, created_at, updated_at) VALUES
  (1, 1, NOW(), NOW()),  -- Sok Dara is homeroom teacher of SE Year 1 - A
  (2, 2, NOW(), NOW()),  -- Chan Sophea of SE Year 1 - B
  (4, 3, NOW(), NOW());  -- Keo Sreymom of ACC Year 1 - A

-- day_of_week: 1 = Monday ... 7 = Sunday. No teacher or room is double-booked.
INSERT INTO schedules (id, class_subject_id, room_id, day_of_week, start_time, end_time, created_at, updated_at) VALUES
  ( 1,  1, 3, 1, '07:30', '09:00', NOW(), NOW()),  -- Mon  SE A  Programming    Lab B201
  ( 2,  2, 3, 2, '07:30', '09:00', NOW(), NOW()),  -- Tue  SE A  Web            Lab B201
  ( 3,  3, 4, 3, '09:15', '10:45', NOW(), NOW()),  -- Wed  SE A  Database       Lab B202
  ( 4,  4, 1, 4, '13:00', '14:30', NOW(), NOW()),  -- Thu  SE A  English        A101
  ( 5,  5, 3, 1, '09:15', '10:45', NOW(), NOW()),  -- Mon  SE B  Programming    Lab B201
  ( 6,  6, 3, 2, '09:15', '10:45', NOW(), NOW()),  -- Tue  SE B  Web            Lab B201
  ( 7,  7, 4, 3, '07:30', '09:00', NOW(), NOW()),  -- Wed  SE B  Database       Lab B202
  ( 8,  8, 1, 5, '13:00', '14:30', NOW(), NOW()),  -- Fri  SE B  English        A101
  ( 9,  9, 2, 1, '13:00', '14:30', NOW(), NOW()),  -- Mon  ACC A Accounting     A102
  (10, 10, 2, 3, '13:00', '14:30', NOW(), NOW()),  -- Wed  ACC A Business Math  A102
  (11, 11, 2, 4, '07:30', '09:00', NOW(), NOW());  -- Thu  ACC A English        A102

-- ---------------------------------------------------------------------
-- 6) One session per lesson for the whole of Term 1
-- ---------------------------------------------------------------------
INSERT INTO attendance_sessions (schedule_id, session_date, status, topic, created_at, updated_at)
SELECT sch.id,
       d::date,
       CASE WHEN d::date < CURRENT_DATE THEN 'completed' ELSE 'planned' END,
       'Week ' || ROW_NUMBER() OVER (PARTITION BY sch.id ORDER BY d),
       NOW(), NOW()
FROM schedules sch
JOIN class_subjects cs ON cs.id = sch.class_subject_id
JOIN classes c ON c.id = cs.class_id
JOIN terms t ON t.id = c.term_id
CROSS JOIN LATERAL generate_series(t.start_date, t.end_date, INTERVAL '1 day') AS d
WHERE EXTRACT(ISODOW FROM d) = sch.day_of_week;

-- ---------------------------------------------------------------------
-- 7) Attendance for every lesson before today
--    about 86% present (1 in 5 of them by QR scan), 8% late, 6% absent
--    (half of the absences are approved leave requests)
-- ---------------------------------------------------------------------
WITH sheet AS (
  SELECT ses.id AS session_id, st.id AS student_id, st.user_id AS student_user,
         tu.user_id AS teacher_user,
         (ses.id * 31 + st.id * 17) % 100 AS h
  FROM attendance_sessions ses
  JOIN schedules sch ON sch.id = ses.schedule_id
  JOIN class_subjects cs ON cs.id = sch.class_subject_id
  JOIN teachers tu ON tu.id = cs.teacher_id
  JOIN students st ON st.class_id = cs.class_id
  WHERE ses.session_date < CURRENT_DATE
), marked AS (
  SELECT *,
         CASE WHEN h < 6 THEN 'absent' WHEN h < 14 THEN 'late' ELSE 'present' END AS status,
         CASE
           WHEN h < 6 AND h % 2 = 0 THEN 'request'
           WHEN h >= 14 AND h % 5 = 0 THEN 'qr'
           ELSE 'teacher'
         END AS source
  FROM sheet
)
INSERT INTO attendance_records
  (attendance_session_id, student_id, status, remark, reason, source, marked_by, take_by,
   approved, approved_by, created_at, updated_at)
SELECT session_id, student_id, status,
       CASE source
         WHEN 'qr' THEN 'scan QR'
         WHEN 'request' THEN 'Sick, sent a leave request'
         ELSE CASE status WHEN 'late' THEN 'Arrived late' WHEN 'absent' THEN 'No notice' ELSE '' END
       END,
       CASE WHEN source = 'request' THEN 'health' ELSE 'attendance_records' END,
       source,
       CASE WHEN source IN ('qr', 'request') THEN student_user ELSE teacher_user END,
       CASE WHEN source IN ('qr', 'request') THEN student_user ELSE teacher_user END,
       1,
       teacher_user,
       NOW(), NOW()
FROM marked;

-- The teacher's own attendance for each past lesson
INSERT INTO teacher_attendance (attendance_session_id, status, remark, created_at, updated_at)
SELECT ses.id,
       CASE WHEN ses.id % 40 = 0 THEN 'on_leave' WHEN ses.id % 25 = 0 THEN 'late' ELSE 'present' END,
       CASE WHEN ses.id % 40 = 0 THEN 'Training workshop' WHEN ses.id % 25 = 0 THEN 'Traffic' ELSE NULL END,
       NOW(), NOW()
FROM attendance_sessions ses
WHERE ses.session_date < CURRENT_DATE;

-- ---------------------------------------------------------------------
-- 8) Three pending leave requests for upcoming lessons (to approve as a demo)
-- ---------------------------------------------------------------------
INSERT INTO attendance_records
  (attendance_session_id, student_id, status, remark, reason, source, marked_by, take_by,
   approved, approved_by, created_at, updated_at)
SELECT next_ses.id, st.id, req.status, req.remark, req.reason, 'request', st.user_id, st.user_id, 0, 0, NOW(), NOW()
FROM (VALUES
  (3,  1, 'absent', 'health',           'Doctor appointment'),        -- Ly Sokha, SE A Programming
  (9,  6, 'late',   'family_emergency', 'Taking my mother to hospital'), -- Sam Nimol, SE B Web
  (15, 9, 'absent', 'personal',         'Family wedding in Siem Reap')   -- Hun Malis, ACC A Accounting
) AS req(student_id, schedule_id, status, reason, remark)
JOIN students st ON st.id = req.student_id
JOIN LATERAL (
  SELECT id FROM attendance_sessions
  WHERE schedule_id = req.schedule_id AND session_date >= CURRENT_DATE
  ORDER BY session_date LIMIT 1
) next_ses ON TRUE;

-- ---------------------------------------------------------------------
-- 9) Continue ids after the ones used above
-- ---------------------------------------------------------------------
DO $$
DECLARE r record; max_id bigint;
BEGIN
  FOR r IN
    SELECT c.table_name
    FROM information_schema.columns c
    WHERE c.table_schema = 'public' AND c.column_name = 'id' AND c.is_identity = 'YES'
  LOOP
    EXECUTE format('SELECT COALESCE(MAX(id), 0) FROM %I', r.table_name) INTO max_id;
    PERFORM setval(pg_get_serial_sequence(r.table_name, 'id'), GREATEST(max_id, 1), max_id > 0);
  END LOOP;
END $$;

COMMIT;
