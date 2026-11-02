const pool = require('../config/db');

const Teachers = {
  async getAll() {
    const [rows] = await pool.query(
      `SELECT t.*, u.name AS user_name, u.email
       FROM teachers t
       JOIN users u ON t.user_id = u.id
       ORDER BY u.name ASC`
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT t.*, u.name AS user_name, u.email
       FROM teachers t
       JOIN users u ON t.user_id = u.id
       WHERE t.id = ?`,
      [id]
    );
    return rows[0] || null;
  },
  async findByUserId(userId) {
    const [rows] = await pool.query('SELECT * FROM teachers WHERE user_id = ?', [userId]);
    return rows[0] || null;
  },

  async getTeacherIdByUserId(userId) {
    const teacher = await this.findByUserId(userId);
    return teacher ? teacher.id : null;
  }, 
  
  async create({ user_id, employee_code }) {
    const [result] = await pool.query(
      `INSERT INTO teachers (user_id, employee_code, created_at, updated_at)
       VALUES (?, ?, NOW(), NOW())`,
      [user_id, employee_code]
    );
    return this.findById(result.insertId);
  },

  async update(id, { user_id, employee_code }) {
    await pool.query(
      `UPDATE teachers
       SET user_id = ?, employee_code = ?, updated_at = NOW()
       WHERE id = ?`,
      [user_id, employee_code, id]
    );
    return this.findById(id);
  },

  async remove(id) {
    await pool.query('DELETE FROM teachers WHERE id = ?', [id]);
  }
};

module.exports = Teachers;
