const pool = require('../config/db');

const SchoolYears = {
  async getAll() {
    const [rows] = await pool.query(
      'SELECT * FROM school_years ORDER BY start_date DESC'
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM school_years WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create({ name, start_date, end_date, start_date_term1, end_date_term1, start_date_term2, end_date_term2 }) {
    const [result] = await pool.query(
      'INSERT INTO school_years (name, start_date, end_date, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      [name, start_date, end_date]
    );
    const [resultTerm1] = await pool.query(
      `INSERT INTO terms (school_year_id, name, start_date, end_date, created_at, updated_at)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [result.insertId, 'Term1', start_date_term1, end_date_term1]
    );
        const [resultTerm2] = await pool.query(
      `INSERT INTO terms (school_year_id, name, start_date, end_date, created_at, updated_at)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [result.insertId, 'Term2', start_date_term2, end_date_term2]
    );
    return this.findById(result.insertId);
  },

  async update(id, { name, start_date, end_date }) {
    await pool.query(
      'UPDATE school_years SET name = ?, start_date = ?, end_date = ?, updated_at = NOW() WHERE id = ?',
      [name, start_date, end_date, id]
    );
    return this.findById(id);
  },

  async remove(id) {
    await pool.query('DELETE FROM school_years WHERE id = ?', [id]);
  }
};

module.exports = SchoolYears;
