require('dotenv').config();
const Database = require('better-sqlite3');

const db = new Database(process.env.DB_PATH || './app.db');

// optional but recommended
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

module.exports = db;