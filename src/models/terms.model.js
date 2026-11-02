const pool = require('../config/db');

const Terms = {
  async getAll() {
    const [rows] = await pool.query(
      `SELECT t.*, sy.name AS school_year_name
       FROM terms t
       JOIN school_years sy ON t.school_year_id = sy.id
       ORDER BY sy.start_date DESC, t.start_date ASC`
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM terms WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create({ school_year_id, name, start_date, end_date }) {
    const [result] = await pool.query(
      `INSERT INTO terms (school_year_id, name, start_date, end_date, created_at, updated_at)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [school_year_id, name, start_date, end_date]
    );
    return this.findById(result.insertId);
  },

  async update(id, { school_year_id, name, start_date, end_date }) {
    await pool.query(
      `UPDATE terms
       SET school_year_id = ?, name = ?, start_date = ?, end_date = ?, updated_at = NOW()
       WHERE id = ?`,
      [school_year_id, name, start_date, end_date, id]
    );
    return this.findById(id);
  },

  async remove(id) {
    await pool.query('DELETE FROM terms WHERE id = ?', [id]);
  }
};

module.exports = Terms;
