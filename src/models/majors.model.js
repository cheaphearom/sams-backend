const pool = require('../config/db');

const Majors = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM majors ORDER BY name ASC');
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM majors WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create({ name, code }) {
    const [result] = await pool.query(
      'INSERT INTO majors (name, code, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
      [name, code]
    );
    return this.findById(result.insertId);
  },

  async update(id, { name, code }) {
    await pool.query(
      'UPDATE majors SET name = ?, code = ?, updated_at = NOW() WHERE id = ?',
      [name, code, id]
    );
    return this.findById(id);
  },

  async remove(id) {
    await pool.query('DELETE FROM majors WHERE id = ?', [id]);
  }
};

module.exports = Majors;
