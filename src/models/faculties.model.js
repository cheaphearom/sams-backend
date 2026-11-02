const pool = require('../config/db');

const Faculties = {

  async getAll() {
    const [rows] = await pool.query(
      'SELECT id, name, code, image, created_at, updated_at FROM faculties ORDER BY name ASC'
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, name, code, image, created_at, updated_at FROM faculties WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async create({ name, code, image }) {
    const [result] = await pool.query(
      `
      INSERT INTO faculties (name, code, image, created_at, updated_at)
      VALUES (?, ?, ?, NOW(), NOW())
      `,
      [name, code, image]
    );
    return this.findById(result.insertId);
  },

  async update(id, { name, code, image }) {
    await pool.query(
      `
      UPDATE faculties
      SET
        name = ?,
        code = ?,
        image = ?,
        updated_at = NOW()
      WHERE id = ?
      `,
      [name, code, image, id]
    );
    return this.findById(id);
  },

  async remove(id) {
    await pool.query('DELETE FROM faculties WHERE id = ?', [id]);
  }
};

module.exports = Faculties;
