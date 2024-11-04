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

  const { puzzle_id, answer } = req.body;

  try {
    const puzzle = await puzzleService.getPuzzleById(puzzle_id);

    if (puzzle.correct_answer.toLowerCase() !== answer.toLowerCase()) {
      botService.sendMessage(`Puzzle "${puzzle_id}" riddle was attempted but failed.`);
      return res.status(403).send(`Incorrect answer for puzzle "${puzzle_id}".`);
    }

    botService.sendMessage(`Puzzle "${puzzle_id}" unlocked! You can now see the instructions for finding the graffiti.`);
    await puzzleService.solveRiddle(puzzle_id);
    logger.info(`Puzzle "${puzzle_id}" unlocked`);
    res.send("Puzzle unlocked!");
  } catch (err) {
    next(err);
  }
});

// POST /puzzles/mark-found - Mark a puzzle as found
router.post('/puzzles/mark-found', async (req, res, next) => {
  const { error } = markFoundSchema.validate(req.body);
  if (error) {
    botService.sendMessage(`An error occurred while marking a puzzle as found: ${error.details[0].message}`);
    return res.status(400).send(error.details[0].message);
  }

  try {
    botService.sendMessage(`Puzzle "${req.body.puzzle_id}" marked as found!`);
    await puzzleService.markAsFound(req.body.puzzle_id);
    logger.info(`Puzzle "${req.body.puzzle_id}" marked as found`);
    res.send("Puzzle marked as found!");
  } catch (err) {
    next(err);
  }
});

// GET /puzzles/final - Fetch final puzzle instructions after all are found
router.get('/puzzles/final', async (req, res, next) => {
  try {
    const allPuzzles = await puzzleService.getPuzzles();
    const allFound = allPuzzles.every(puzzle => puzzle.is_found);

    if (!allFound) {
      botService.sendMessage("All puzzles are not completed yet. Complete all puzzles to access the final instructions.");
      return res.status(403).send("Complete all initial puzzles to access the final instructions.");
    }

    botService.sendMessage("All puzzles are completed! Final instructions are now available.");
    logger.info("Final instructions are available");

    const finalInstructions = {
      puzzle_id: "final",
      hint: "To access your prize, enter the final password. (напиши мені, якщо не знаєш пароль 😉)",
      is_unlocked: true
    };

    res.json(finalInstructions);
  } catch (err) {
    next(err);
  }
});

// POST /prize - Check final password and provide prize access
router.post('/prize', async (req, res, next) => {
  try {
    const { answer } = req.body;
    const finalPuzzle = await puzzleService.getPuzzleById("final");

    if (finalPuzzle.correct_answer === answer) {
      botService.sendMessage("Correct password entered! Prize is unlocked.");
      logger.info("Prize unlocked");

      const prize = {
        message: "Congratulations! You unlocked the prize.",
        url: 'https://drive.google.com/file/d/1SPn7mP8DslMoP0kPBFUAxqqrM4IlyqIE/view?usp=sharing'
      };

      return res.json(prize);
    } else {
      botService.sendMessage("Incorrect password attempt for prize.");
      return res.status(403).send("Incorrect password.");
    }
  } catch (err) {
    next(err);
  }
});

// Lock all puzzles: reset to initial state
router.post('/lock-all', async (req, res, next) => {
  try {
    botService.sendMessage("All puzzles have been locked and reset to the initial state.");
    await puzzleService.lockAllPuzzles();  // Call the service to lock all puzzles
    logger.info("All puzzles have been locked.");
    res.send("All puzzles have been successfully locked.");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
