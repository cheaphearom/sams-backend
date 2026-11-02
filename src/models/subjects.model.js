const pool = require('../config/db');

const Subjects = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM subjects ORDER BY name ASC');
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM subjects WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create({ code, name, credit }) {
    const [result] = await pool.query(
      `INSERT INTO subjects (code, name, credit, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW())`,
      [code, name, credit]
    );
    return this.findById(result.insertId);
  },

  async update(id, { code, name, credit }) {
    await pool.query(
      `UPDATE subjects
       SET code = ?, name = ?, credit = ?, updated_at = NOW()
       WHERE id = ?`,
      [code, name, credit, id]
    );
    return this.findById(id);
  },

  async remove(id) {
    await pool.query('DELETE FROM subjects WHERE id = ?', [id]);
  }
};

module.exports = Subjects;
