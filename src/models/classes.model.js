const pool = require('../config/db');

const Classes = {
  async getAll() {
    const [rows] = await pool.query(
      `SELECT c.*,
              m.name  AS major_name,
              sy.name AS school_year_name,
              t.name  AS term_name
       FROM classes c
       JOIN school_years sy ON c.school_year_id = sy.id
       JOIN terms t ON c.term_id = t.id
       LEFT JOIN majors m ON c.major_id = m.id
       ORDER BY sy.start_date DESC, c.name ASC`
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM classes WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create({ name, grade_level, major_id, school_year_id, term_id }) {
    const [result] = await pool.query(
      `INSERT INTO classes
         (name, grade_level, major_id, school_year_id, term_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [name, grade_level, major_id, school_year_id, term_id]
    );
    return this.findById(result.insertId);
  },

  async update(id, { name, grade_level, major_id, school_year_id, term_id }) {
    await pool.query(
      `UPDATE classes
         SET name = ?, grade_level = ?, major_id = ?, school_year_id = ?, term_id = ?, updated_at = NOW()
       WHERE id = ?`,
      [name, grade_level, major_id, school_year_id, term_id, id]
    );
    return this.findById(id);
  },

  async remove(id) {
    await pool.query('DELETE FROM classes WHERE id = ?', [id]);
  }
};

module.exports = Classes;
