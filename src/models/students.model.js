const pool = require('../config/db');

const Students = {
  async getAll() {
    const [rows] = await pool.query(
      `SELECT s.*, u.name AS user_name, u.email, c.name AS class_name
       FROM students s
       JOIN users u ON s.user_id = u.id
       JOIN classes c ON s.class_id = c.id
       ORDER BY s.id DESC`
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT s.*, u.name AS user_name, u.email, c.name AS class_name
       FROM students s
       JOIN users u ON s.user_id = u.id
       JOIN classes c ON s.class_id = c.id
       WHERE s.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async findByUserId(id) {
    const [rows] = await pool.query(
      `SELECT s.*, u.name AS user_name, u.email
       FROM students s
       JOIN users u ON s.user_id = u.id
       WHERE u.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async findByClass(class_id) {
    const [rows] = await pool.query(
      `SELECT s.*, u.name AS user_name, u.email
       FROM students s
       JOIN users u ON s.user_id = u.id
       WHERE s.class_id = ?
       ORDER BY u.name ASC`,
      [class_id]
    );
    return rows;
  },

  async create({ user_id,first_name, last_name, image, student_code, class_id }) {
    const [result] = await pool.query(
      `INSERT INTO students (user_id, first_name, last_name, image, student_code, class_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [user_id, first_name, last_name, image, student_code, class_id]
    );
    console.log(result);
    
    return this.findById(result.insertId);
  },

  async update(id, { user_id, student_code, class_id }) {
    await pool.query(
      `UPDATE students
       SET student_code = ?, class_id = ?, updated_at = NOW()
       WHERE id = ?`,
      [student_code, class_id, id]
    );
    return this.findById(id);
  },
  
  async updateFaceDescriptorByUserId(user_id, face_descriptor) {
    await pool.query(
      `UPDATE students SET face_descriptor = ?, updated_at = NOW() WHERE user_id = ?`,
      [face_descriptor, user_id]
    );
    return this.findByUserId(user_id);
  },

  async remove(id) {
    await pool.query('DELETE FROM students WHERE id = ?', [id]);
  }
};

module.exports = Students;
