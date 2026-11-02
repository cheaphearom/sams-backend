const pool = require('../config/db');

const Rooms = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM rooms ORDER BY name ASC');
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM rooms WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create({ name, capacity }) {
    const [result] = await pool.query(
      `INSERT INTO rooms (name, capacity, created_at, updated_at)
       VALUES (?, ?, NOW(), NOW())`,
      [name, capacity]
    );
    return this.findById(result.insertId);
  },

  async update(id, { name, capacity }) {
    await pool.query(
      `UPDATE rooms
       SET name = ?, capacity = ?, updated_at = NOW()
       WHERE id = ?`,
      [name, capacity, id]
    );
    return this.findById(id);
  },

  async remove(id) {
    await pool.query('DELETE FROM rooms WHERE id = ?', [id]);
  }
};

module.exports = Rooms;
