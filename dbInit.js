const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/graffitiQuiz.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      puzzle_id TEXT UNIQUE,
      is_solved BOOLEAN DEFAULT FALSE,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("Database initialized");
});

db.close();
