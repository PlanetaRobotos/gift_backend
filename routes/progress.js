// routes/progress.js

const express = require('express');
const router = express.Router();
const botService = require('../services/botService');
const puzzleService = require('../services/puzzleService');
const { solveRiddleSchema, markFoundSchema } = require('../validationSchemas');
const logger = require('../logger');

// GET /puzzles - Fetch all puzzles
router.get('/puzzles', async (req, res, next) => {
  try {
    const puzzles = await puzzleService.getPuzzles();
    res.json(puzzles);
  } catch (error) {
    next(error); // Pass error to middleware
  }
});

// POST /puzzles/solve-riddle - Unlock a puzzle by solving the riddle
router.post('/puzzles/solve-riddle', async (req, res, next) => {
  const { error } = solveRiddleSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    await puzzleService.solveRiddle(req.body.puzzle_id);
    botService.sendMessage(`Puzzle "${req.body.puzzle_id}" unlocked! You can now see the instructions for finding the graffiti.`);
    logger.info(`Puzzle "${req.body.puzzle_id}" unlocked`);
    res.send("Puzzle unlocked!");
  } catch (err) {
    next(err);
  }
});

// POST /puzzles/mark-found - Mark a puzzle as found
router.post('/puzzles/mark-found', async (req, res, next) => {
  const { error } = markFoundSchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    await puzzleService.markAsFound(req.body.puzzle_id);
    botService.sendMessage(`Puzzle "${req.body.puzzle_id}" marked as found!`);
    logger.info(`Puzzle "${req.body.puzzle_id}" marked as found`);
    res.send("Puzzle marked as found!");
  } catch (err) {
    next(err);
  }
});

// GET /puzzles/final - Fetch final puzzle after all are found
router.get('/puzzles/final', async (req, res, next) => {
  try {
    const allPuzzles = await puzzleService.getPuzzles();
    const allFound = allPuzzles.every(puzzle => puzzle.is_found);

    if (!allFound) {
      return res.status(403).send("Complete all initial puzzles to access the final puzzle.");
    }

    botService.sendMessage("All puzzles are completed! The final puzzle is now available.");
    logger.info("Final puzzle is available");

    const finalPuzzle = {
      puzzle_id: "final",
      hint: "Combine all elements you've found to locate the final graffiti.",
      is_unlocked: true
    };

    res.json(finalPuzzle);
  } catch (err) {
    next(err);
  }
});

// GET /prize - Access the final prize (song)
router.get('/prize', async (req, res, next) => {
  try {
    const finalPuzzle = await puzzleService.getFinalPuzzle();
    if (!finalPuzzle || !finalPuzzle.is_solved) {
      return res.status(403).send("Complete the final puzzle to access the prize.");
    }

    botService.sendMessage("Congratulations! You've completed all puzzles. Here’s your prize!");
    logger.info("Prize accessed");

    const prize = {
      url: "https://path-to-your-song-file.com/your-song.mp3",
      message: "Congratulations! Here is your prize."
    };

    res.json(prize);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
