// Creates the tables on the database in DATABASE_URL and loads the rows from the MySQL dump.
// Runs in one transaction: if anything fails, nothing is changed on the database.
// It stops if the tables already exist, so it can't overwrite data. Usage: npm run db:import
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

const ROOT = path.join(__dirname, '..');
const SCHEMA_FILE = path.join(ROOT, 'database', 'schema.postgres.sql');
const DUMP_FILE = path.join(ROOT, 'drawSQL-mysql-export.sql');

// Parents before children, so foreign keys are satisfied while loading
const LOAD_ORDER = [
  'users', 'faculties', 'departments', 'majors', 'school_years', 'terms', 'classes',
  'teachers', 'students', 'subjects', 'class_subjects', 'teacher_classes', 'rooms', 'schedules',
  'attendance_sessions', 'attendance_records', 'attendance_checkins', 'teacher_attendance',
  'face_verification_logs', 'schools'
];

function parseColumns(dump) {
  const tables = {};
  for (const match of dump.matchAll(/CREATE TABLE `(\w+)` \(([\s\S]*?)\n\) ENGINE/g)) {
    const columns = [...match[2].matchAll(/^\s*`(\w+)` (\w+)/gm)];
    tables[match[1]] = columns.map(([, name, type]) => ({ name, type }));
  }
  return tables;
}

const ESCAPES = { n: '\n', r: '\r', t: '\t', 0: '\0', b: '\b', Z: '\x1a' };

// Parses "(1,'a',NULL),(2,'b\'c',3.5)" into rows of values
function parseRows(text) {
  const rows = [];
  let row = null;
  let i = 0;

  while (i < text.length) {
    const char = text[i];

    if (char === '(' && !row) {
      row = [];
      i++;
    } else if (char === ')') {
      rows.push(row);
      row = null;
      i++;
    } else if (char === ',' || char === ';') {
      i++;
    } else if (char === "'") {
      let value = '';
      i++;
      while (text[i] !== "'" || text[i + 1] === "'") {
        if (text[i] === '\\') {
          value += ESCAPES[text[i + 1]] ?? text[i + 1];
          i += 2;
        } else if (text[i] === "'") {
          value += "'";
          i += 2;
        } else {
          value += text[i++];
        }
      }
      i++;
      row.push(value);
    } else {
      const start = i;
      while (text[i] !== ',' && text[i] !== ')') i++;
      const raw = text.slice(start, i);
      row.push(raw === 'NULL' ? null : raw);
    }
  }
  return rows;
}

// MySQL TIME allows values past midnight such as 24:30:00, postgres stops at 24:00:00
function fixTimes(table, columns, rows) {
  columns.forEach((column, index) => {
    if (column.type !== 'time') return;
    for (const row of rows) {
      if (row[index] && row[index] > '24:00:00') {
        console.warn(`  ${table} id=${row[0]}: ${column.name} ${row[index]} changed to 24:00:00`);
        row[index] = '24:00:00';
      }
    }
  });
}

async function loadTable(client, table, columns, rows) {
  const names = columns.map((column) => column.name).join(', ');
  const values = [];
  const placeholders = rows.map((row) => {
    if (row.length !== columns.length) {
      throw new Error(`${table}: row has ${row.length} values, expected ${columns.length}`);
    }
    return `(${row.map((value) => `$${values.push(value)}`).join(', ')})`;
  });

  await client.query(`INSERT INTO ${table} (${names}) VALUES ${placeholders.join(', ')}`, values);

  const { rows: [{ count }] } = await client.query(`SELECT COUNT(*)::int AS count FROM ${table}`);
  if (count !== rows.length) {
    throw new Error(`${table}: loaded ${count} rows, expected ${rows.length}`);
  }
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined. Add your Neon connection string to .env');
  }

  const dump = fs.readFileSync(DUMP_FILE, 'utf8');
  const tables = parseColumns(dump);

  const unknown = Object.keys(tables).filter((table) => !LOAD_ORDER.includes(table));
  if (unknown.length) throw new Error(`Tables missing from LOAD_ORDER: ${unknown.join(', ')}`);

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    await client.query('BEGIN');
    await client.query(fs.readFileSync(SCHEMA_FILE, 'utf8'));
    console.log('Schema created');

    for (const table of LOAD_ORDER) {
      const line = dump.split('\n').find((text) => text.startsWith(`INSERT INTO \`${table}\` VALUES `));
      const rows = line ? parseRows(line.slice(line.indexOf(' VALUES ') + 8).trim()) : [];

      if (rows.length) {
        fixTimes(table, tables[table], rows);
        await loadTable(client, table, tables[table], rows);
      }

      // New rows must continue after the highest imported id
      await client.query(
        `SELECT setval(pg_get_serial_sequence('${table}', 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM ${table}`
      );
      console.log(`  ${table}: ${rows.length} rows`);
    }

    await client.query('COMMIT');
    console.log('Import finished');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('Import failed, nothing was changed:', err.message);
  process.exit(1);
});
