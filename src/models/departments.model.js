const pool = require('../config/db');

const Departments = {
  async getAll() {
    const [rows] = await pool.query(
      `SELECT d.*,
              f.name AS faculty_name
       FROM departments d
       JOIN faculties f ON d.faculty_id = f.id
       ORDER BY f.name ASC, d.name ASC`
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT d.*,
              f.name AS faculty_name
       FROM departments d
       JOIN faculties f ON d.faculty_id = f.id
       WHERE d.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async findByFaculty(faculty_id) {
    const [rows] = await pool.query(
      `SELECT d.*,
              f.name AS faculty_name
       FROM departments d
       JOIN faculties f ON d.faculty_id = f.id
       WHERE d.faculty_id = ?
       ORDER BY d.name ASC`,
      [faculty_id]
    );
    return rows;
  },

  async create({ faculty_id, name, code }) {
    const [result] = await pool.query(
      `INSERT INTO departments
         (faculty_id, name, code, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW())`,
      [faculty_id, name, code]
    );
    return this.findById(result.insertId);
  },

  async update(id, { faculty_id, name, code }) {
    await pool.query(
      `UPDATE departments
       SET faculty_id = ?, name = ?, code = ?, updated_at = NOW()
       WHERE id = ?`,
      [faculty_id, name, code, id]
    );
    return this.findById(id);
  },

  async remove(id) {
    await pool.query('DELETE FROM departments WHERE id = ?', [id]);
  },
};

module.exports = Departments;
