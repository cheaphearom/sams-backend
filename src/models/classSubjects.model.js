const pool = require('../config/db');

const ClassSubjects = {
  async getAll() {
    const [rows] = await pool.query(
      `SELECT cs.*, c.name AS class_name, s.name AS subject_name, u.name AS teacher_name
       FROM class_subjects cs
       JOIN classes c ON cs.class_id = c.id
       JOIN subjects s ON cs.subject_id = s.id
       LEFT JOIN teachers t ON cs.teacher_id = t.id
       LEFT JOIN users u ON t.user_id = u.id
       ORDER BY c.name ASC, s.name ASC`
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT cs.*, c.name AS class_name, s.name AS subject_name, u.name AS teacher_name
       FROM class_subjects cs
       JOIN classes c ON cs.class_id = c.id
       JOIN subjects s ON cs.subject_id = s.id
       LEFT JOIN teachers t ON cs.teacher_id = t.id
       LEFT JOIN users u ON t.user_id = u.id
       WHERE cs.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async findByClass(class_id) {
    const [rows] = await pool.query(
      `SELECT cs.*, s.name AS subject_name, u.name AS teacher_name
       FROM class_subjects cs
       JOIN subjects s ON cs.subject_id = s.id
       LEFT JOIN teachers t ON cs.teacher_id = t.id
       LEFT JOIN users u ON t.user_id = u.id
       WHERE cs.class_id = ?`,
      [class_id]
    );
    return rows;
  },

  async create({ class_id, subject_id, teacher_id }) {
    const [result] = await pool.query(
      `INSERT INTO class_subjects (class_id, subject_id, teacher_id, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW())`,
      [class_id, subject_id, teacher_id]
    );
    return this.findById(result.insertId);
  },

  async update(id, { class_id, subject_id, teacher_id }) {
    await pool.query(
      `UPDATE class_subjects
       SET class_id = ?, subject_id = ?, teacher_id = ?, updated_at = NOW()
       WHERE id = ?`,
      [class_id, subject_id, teacher_id, id]
    );
    return this.findById(id);
  },

  async remove(id) {
    await pool.query('DELETE FROM class_subjects WHERE id = ?', [id]);
  }
};

module.exports = ClassSubjects;
