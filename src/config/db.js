const { Pool, types } = require('pg');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined. Add your Neon connection string to .env');
}

// BIGINT (ids, COUNT, SUM) comes back as a string by default, keep it a number
types.setTypeParser(types.builtins.INT8, Number);

const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  connectionTimeoutMillis: 15000 // a suspended Neon database needs a moment to wake up
});

// Neon closes idle connections, without this listener that would crash the process
pgPool.on('error', (err) => console.error('Idle DB connection error:', err.message));

// Models write "?" placeholders, postgres wants $1, $2...
// An array of arrays expands to rows, for bulk inserts: VALUES ?
function toPostgres(sql, params = []) {
  const values = [];
  let paramIndex = 0;
  let quote = null;
  let text = '';

  const addValue = (value) => {
    values.push(typeof value === 'boolean' ? Number(value) : value);
    return `$${values.length}`;
  };

  for (const char of sql) {
    if (quote) {
      if (char === quote) quote = null;
      text += char;
    } else if (char === "'" || char === '"') {
      quote = char;
      text += char;
    } else if (char === '?') {
      const param = params[paramIndex++];
      if (Array.isArray(param) && Array.isArray(param[0])) {
        text += param.map((row) => `(${row.map(addValue).join(', ')})`).join(', ');
      } else {
        text += addValue(param);
      }
    } else {
      text += char;
    }
  }

  if (/^\s*INSERT\b/i.test(text)) {
    text = `${text.trim().replace(/;$/, '')} RETURNING id`;
  }

  return { text, values };
}

// Same result shape as before: [rows, fields] for SELECT, [{ insertId, affectedRows }, fields] otherwise
async function run(client, sql, params) {
  const result = await client.query(toPostgres(sql, params));

  if (result.command === 'SELECT') return [result.rows, result.fields];

  return [
    { insertId: result.rows[0]?.id ?? 0, affectedRows: result.rowCount },
    result.fields
  ];
}

const pool = {
  query: (sql, params) => run(pgPool, sql, params),

  async getConnection() {
    const client = await pgPool.connect();
    return {
      query: (sql, params) => run(client, sql, params),
      beginTransaction: () => client.query('BEGIN'),
      commit: () => client.query('COMMIT'),
      rollback: () => client.query('ROLLBACK'),
      release: () => client.release()
    };
  }
};

module.exports = pool;
