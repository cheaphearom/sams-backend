// ⚠️ Deletes ALL data in the database from DATABASE_URL and loads the demo data
// in database/seed/seed.sql. Pending migrations are applied first.
// Usage: npm run db:reset -- --yes
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const { runMigrations } = require('../src/config/migrations');

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is not set. Add it to .env');
  process.exit(1);
}

let target = url;
try {
  const u = new URL(url);
  target = `${u.hostname}${u.pathname}`;
} catch { /* show the raw value if it isn't a URL */ }

if (!process.argv.includes('--yes')) {
  console.log(`This DELETES ALL DATA in ${target} and loads the demo data.`);
  console.log('Run again with --yes to confirm:  npm run db:reset -- --yes');
  process.exit(1);
}

(async () => {
  console.log(`Resetting ${target} ...`);
  await runMigrations();

  const sql = fs.readFileSync(path.join(__dirname, '..', 'database', 'seed', 'seed.sql'), 'utf8');
  const client = new Client({ connectionString: url });
  await client.connect();
  try {
    await client.query(sql); // the file has its own BEGIN / COMMIT
    const { rows } = await client.query(`
      SELECT (SELECT COUNT(*) FROM users WHERE role = 'admin')   AS admins,
             (SELECT COUNT(*) FROM teachers)                     AS teachers,
             (SELECT COUNT(*) FROM students)                     AS students,
             (SELECT COUNT(*) FROM classes)                      AS classes,
             (SELECT COUNT(*) FROM attendance_sessions)          AS sessions,
             (SELECT COUNT(*) FROM attendance_records)           AS records`);
    const c = rows[0];
    console.log(
      `Done: ${c.admins} admin, ${c.teachers} teachers, ${c.students} students, ${c.classes} classes, ` +
        `${c.sessions} sessions, ${c.records} attendance records`
    );
    console.log('Log in as admin@sams.demo with password Sams@2026');
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Reset failed, nothing was changed:', err.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
})();
