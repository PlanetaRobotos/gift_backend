// routes/progress.js

const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const router = express.Router();
const connectToDatabase = require('../database');

const token = '7736822280:AAEd62KQK5F4bS-U5E5wj1J2mqxVfrd205w';
const bot = new TelegramBot(token, { polling: true });
const notifyUserId = 565393549

bot.on('message', (msg) => {
  console.log(msg)

  const chatId = msg.chat.id;
  const userMessage = msg.text;

  bot.sendMessage(chatId, `You said: "${userMessage}". Try sending /ping for a surprise!`);
});

router.get('/status', async (req, res) => {
  try {
    console.log("get status init");
    const db = await connectToDatabase();
    console.log("get status connected");
    const collection = db.collection('GiftCollection');

    const progressData = await collection.find({}).toArray();
    res.json(progressData);
  } catch (error) {
    console.error("Database error:", error.message);
    res.status(500).send("Failed to retrieve progress data");
  }
});

router.post('/update', async (req, res) => {
  console.log("Request Body:", req);

  const { puzzle_id, is_solved } = req.body;

  if (!puzzle_id || is_solved === undefined) {
    return res.status(400).send("Missing puzzle_id or is_solved parameter");
  }

  bot.sendMessage(notifyUserId, 'Response')

  try {
    const db = await connectToDatabase();
    const collection = db.collection('GiftCollection');

    await collection.updateOne(
      { puzzle_id: puzzle_id },
      { $set: { is_solved: is_solved, last_updated: new Date() } },
      { upsert: true }
    );

    res.send("Progress updated successfully");
  } catch (error) {
    console.error("Database error:", error.message);
    res.status(500).send("Failed to update progress");
  }
});

router.post('/lock-all', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('GiftCollection');

    // Update all puzzles to set is_solved to false
    await collection.updateMany({}, { $set: { is_solved: false } });

    res.send("All puzzles have been locked.");
  } catch (error) {
    console.error("Error locking all puzzles:", error);
    res.status(500).send("Failed to lock all puzzles.");
  }
});

module.exports = router;
