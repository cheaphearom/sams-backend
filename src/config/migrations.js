// Applies the SQL files in database/migrations that haven't run yet, in name order.
// Applied files are recorded in schema_migrations, so each runs once. An advisory
// lock stops two server instances (e.g. two Vercel cold starts) running them at once.
// Each file runs in its own transaction: if it fails, nothing from it is applied.
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const MIGRATIONS_DIR = path.join(__dirname, '..', '..', 'database', 'migrations');
const LOCK_ID = 727274; // any constant, shared by every instance of this app

async function runMigrations({ log = console.log } = {}) {
  const files = fs.existsSync(MIGRATIONS_DIR)
    ? fs.readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith('.sql')).sort()
    : [];
  if (files.length === 0) return [];

  // A plain client (not the app pool): migration files hold several statements
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const applied = [];

  try {
    await client.query('SELECT pg_advisory_lock($1)', [LOCK_ID]);
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`);

    const { rows } = await client.query('SELECT name FROM schema_migrations');
    const done = new Set(rows.map((r) => r.name));

    for (const file of files) {
      if (done.has(file)) continue;
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
      try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
        await client.query('COMMIT');
      } catch (err) {
        await client.query('ROLLBACK').catch(() => {});
        err.message = `Migration ${file} failed, nothing from it was applied: ${err.message}`;
        throw err;
      }
      applied.push(file);
      log(`Applied migration ${file}`);
    }
    return applied;
  } finally {
    await client.query('SELECT pg_advisory_unlock($1)', [LOCK_ID]).catch(() => {});
    await client.end().catch(() => {});
  }
}

// Express middleware: the first request waits until migrations are done,
// later requests pass straight through. A failure is retried on the next request.
let ready = null;
function ensureMigrated(req, res, next) {
  if (!ready) {
    ready = runMigrations().catch((err) => {
      ready = null;
      throw err;
    });
  }
  ready.then(() => next(), next);
}

module.exports = { runMigrations, ensureMigrated };
