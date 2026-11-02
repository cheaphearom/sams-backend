// src/server.js
require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 4000;
const HOST = 'localhost';

(async () => {
  try {
    // Test DB connection
    await pool.query('SELECT 1');
    console.log('PostgreSQL connected');

    app.listen(PORT, () => {
      console.log(`API running at http://${HOST}:${PORT}`);
    });
  } catch (err) {
    console.error('Unable to connect to DB:', err.message);
    process.exit(1);
  }
})();
