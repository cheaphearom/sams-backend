const pool = require('../config/db');

const Users = {
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE lower(email) = lower(?)', [email]);
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async getAll() {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, image, created_at, updated_at FROM users ORDER BY id DESC'
    );
    return rows;
  },

  async create({ name, email, password_hash, role, image }) {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, role, image, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [name, email, password_hash, role, image]
    );
    return this.findById(result.insertId);
  },

  async update(id, { name, email, role, image }) {
    await pool.query(
      'UPDATE users SET name = ?, email = ?, role = ?, image = ?, updated_at = NOW() WHERE id = ?',
      [name, email, role, image, id]
    );
    return this.findById(id);
  },

  async remove(id) {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
  }
};

module.exports = Users;
