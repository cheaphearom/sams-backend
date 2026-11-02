// Runs every .sql file in database/migrations in name order.
// Each migration is written to be safe to run more than once.
// Usage: npm run db:migrate   (reads DATABASE_URL from .env)
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

(async () => {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set. Add it to .env');
    process.exit(1);
  }

  const dir = path.join(__dirname, '..', 'database', 'migrations');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    for (const file of files) {
      const sql = fs.readFileSync(path.join(dir, file), 'utf8');
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('COMMIT');
      console.log(`✔ ${file}`);
    }
    console.log('Migrations done');
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Migration failed, nothing from that file was applied:', err.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
})();
