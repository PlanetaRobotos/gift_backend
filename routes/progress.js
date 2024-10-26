// routes/progress.js

const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

// Connect to SQLite database
const db = new sqlite3.Database('./data/graffitiQuiz.db');

const token = '7736822280:AAEd62KQK5F4bS-U5E5wj1J2mqxVfrd205w';
const bot = new TelegramBot(token, { polling: true });
const notifyUserId = 565393549

bot.on('message', (msg) => {
  console.log(msg)

  const chatId = msg.chat.id;
  const userMessage = msg.text;

  bot.sendMessage(chatId, `You said: "${userMessage}". Try sending /ping for a surprise!`);
});

router.get('/status', (req, res) => {
  db.all("SELECT * FROM progress", [], (err, rows) => {
    if (err) {
      return res.status(500).send("Error retrieving progress data");
    }
    res.json(rows);
  });
});

router.post('/update', (req, res) => {
  console.log("Request Body:", req);

  const { puzzle_id, is_solved } = req.body;

  // Check if puzzle_id and is_solved are provided
  if (!puzzle_id || is_solved === undefined) {
    return res.status(400).send("Missing puzzle_id or is_solved parameter");
  }

  bot.sendMessage(notifyUserId, 'Response')

  // Insert or update the puzzle progress in the database
  db.run(
    `INSERT INTO progress (puzzle_id, is_solved) VALUES (?, ?)
     ON CONFLICT(puzzle_id) DO UPDATE SET is_solved = excluded.is_solved, last_updated = CURRENT_TIMESTAMP`,
    [puzzle_id, is_solved],
    function (err) {
      if (err) {
        console.error("Database error:", err.message);
        return res.status(500).send("Failed to update progress");
      }
      res.send("Progress updated successfully");
    }
  );
});

module.exports = router;
