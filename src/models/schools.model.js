const pool = require('../config/db');

const Schools = {

  async getAll() {
    const [rows] = await pool.query(
      'SELECT id, name, image, created_at, updated_at FROM schools ORDER BY name ASC'
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, name, image, latitude, longitude, created_at, updated_at FROM schools WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async create({ name, image }) {
    const [result] = await pool.query(
      `
      INSERT INTO schools (name, image, created_at, updated_at)
      VALUES (?, ?, NOW(), NOW())
      `,
      [name, image]
    );
    return this.findById(result.insertId);
  },

  async update(id, { name, latitude, longitude, image }) {
    await pool.query(
      `
      UPDATE schools
      SET
        name = ?,
        image = ?,
        latitude = ?,
        longitude = ?,
        updated_at = NOW()
      WHERE id = ?
      `,
      [name, image, latitude, longitude, id]
    );
    return this.findById(id);
  },

  async remove(id) {
    await pool.query('DELETE FROM schools WHERE id = ?', [id]);
  }
};

module.exports = Schools;
