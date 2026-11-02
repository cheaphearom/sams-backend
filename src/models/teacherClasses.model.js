const pool = require('../config/db');

const TeacherClasses = {
  async getAll() {
    const [rows] = await pool.query(
      `SELECT tc.*,
              c.name AS class_name,
              t.first_name,
              t.last_name,
              u.name AS teacher_name
       FROM teacher_classes tc
       JOIN classes c   ON tc.class_id = c.id
       JOIN teachers t  ON tc.teacher_id = t.id
       LEFT JOIN users u ON t.user_id = u.id
       ORDER BY (u.name IS NULL), u.name ASC, c.name ASC`
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT tc.*,
              c.name AS class_name,
              t.first_name,
              t.last_name,
              u.name AS teacher_name
       FROM teacher_classes tc
       JOIN classes c   ON tc.class_id = c.id
       JOIN teachers t  ON tc.teacher_id = t.id
       LEFT JOIN users u ON t.user_id = u.id
       WHERE tc.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async findByTeacher(teacher_id) {
    const [rows] = await pool.query(
      `SELECT tc.*,
              c.name AS class_name
       FROM teacher_classes tc
       JOIN classes c ON tc.class_id = c.id
       WHERE tc.teacher_id = ?
       ORDER BY c.name ASC`,
      [teacher_id]
    );
    return rows;
  },

  async findByClass(class_id) {
    const [rows] = await pool.query(
      `SELECT tc.*,
              t.first_name,
              t.last_name,
              u.name AS teacher_name
       FROM teacher_classes tc
       JOIN teachers t   ON tc.teacher_id = t.id
       LEFT JOIN users u ON t.user_id = u.id
       WHERE tc.class_id = ?
       ORDER BY (u.name IS NULL), u.name ASC`,
      [class_id]
    );
    return rows;
  },

  // for teacher login (user_id -> teacher -> classes)
  async findByUser(user_id) {
    const [rows] = await pool.query(
      `SELECT tc.*,
              c.name AS class_name
       FROM teachers t
       JOIN teacher_classes tc ON tc.teacher_id = t.id
       JOIN classes c          ON tc.class_id = c.id
       WHERE t.user_id = ?
       ORDER BY c.name ASC`,
      [user_id]
    );
    return rows;
  },

  async create({ teacher_id, class_id }) {
    const [result] = await pool.query(
      `INSERT INTO teacher_classes
         (teacher_id, class_id, created_at, updated_at)
       VALUES (?, ?, NOW(), NOW())`,
      [teacher_id, class_id]
    );
    return this.findById(result.insertId);
  },

  async update(id, { teacher_id, class_id }) {
    await pool.query(
      `UPDATE teacher_classes
       SET teacher_id = ?, class_id = ?, updated_at = NOW()
       WHERE id = ?`,
      [teacher_id, class_id, id]
    );
    return this.findById(id);
  },

  async remove(id) {
    await pool.query('DELETE FROM teacher_classes WHERE id = ?', [id]);
  },
  //teachers
  async getMyClasses(teacherId) {
    const [rows] = await pool.query(
      `SELECT
         c.*,
         m.name  AS major_name,
         sy.name AS school_year_name,
         t.name  AS term_name,
         (SELECT COUNT(*) FROM students s WHERE s.class_id = c.id) AS student_count
       FROM teacher_classes tc
       JOIN classes c ON tc.class_id = c.id
       JOIN school_years sy ON c.school_year_id = sy.id
       JOIN terms t ON c.term_id = t.id
       LEFT JOIN majors m ON c.major_id = m.id
       WHERE tc.teacher_id = ?
       ORDER BY sy.start_date DESC, c.name ASC`,
      [teacherId]
    );
    return rows;
  },
  async getMyClassById(teacherId, classId) {
    const [rows] = await pool.query(
      `SELECT
         c.*,
         m.name  AS major_name,
         sy.name AS school_year_name,
         t.name  AS term_name
       FROM teacher_classes tc
       JOIN classes c ON tc.class_id = c.id
       JOIN school_years sy ON c.school_year_id = sy.id
       JOIN terms t ON c.term_id = t.id
       LEFT JOIN majors m ON c.major_id = m.id
       WHERE tc.teacher_id = ? AND c.id = ?
       LIMIT 1`,
      [teacherId, classId]
    );
    return rows[0] || null;
  },
  async getStudentsInClass(teacherId, classId) {
    // ensure teacher owns this class
    const owned = await this.getMyClassById(teacherId, classId);
    if (!owned) return null;

    const [rows] = await pool.query(
      `SELECT id, user_id, first_name, last_name, image, student_code, class_id, status, created_at, updated_at
       FROM students
       WHERE class_id = ?
       ORDER BY student_code ASC`,
      [classId]
    );
    return rows;
  }
};

module.exports = TeacherClasses;
