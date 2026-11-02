// Applies pending database migrations (database/migrations/*.sql).
// The server also does this on its first request, so running it by hand is optional.
// Usage: npm run db:migrate   (reads DATABASE_URL from .env)
require('dotenv').config();
const { runMigrations } = require('../src/config/migrations');

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Add it to .env');
  process.exit(1);
}

runMigrations()
  .then((applied) => {
    console.log(applied.length ? `Done, applied ${applied.length} migration(s)` : 'Database is already up to date');
  })
  .catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  });
