// Vercel entry point: Vercel runs the Express app as a serverless function,
// so it needs the app exported instead of app.listen() (that stays in src/server.js for local use)
require('dotenv').config();
module.exports = require('../src/app');
