// puzzleService.js
const connectToDatabase = require('../database');
const { GIFT_COLLECTION } = require('../config');

const getPuzzles = async () => {
  const db = await connectToDatabase();
  return db.collection(GIFT_COLLECTION).find({ puzzle_id: { $ne: "final" } }).toArray();
};

const getPuzzleById = async (puzzle_id) => {
  const db = await connectToDatabase();
  return db.collection(GIFT_COLLECTION).findOne({ puzzle_id });
};

const solveRiddle = async (puzzle_id) => {
  const db = await connectToDatabase();
  return db.collection(GIFT_COLLECTION).updateOne({ puzzle_id }, { $set: { is_unlocked: true } });
};

const markAsFound = async (puzzle_id) => {
  const db = await connectToDatabase();
  return db.collection(GIFT_COLLECTION).updateOne({ puzzle_id }, { $set: { is_found: true } });
};

const getFinalPuzzle = async () => {
  const db = await connectToDatabase();
  return db.collection(GIFT_COLLECTION).findOne({ puzzle_id: "final" });
};

// Lock all puzzles by setting is_unlocked and is_found to false
const lockAllPuzzles = async () => {
  const db = await connectToDatabase();
  await db.collection(GIFT_COLLECTION).updateMany(
    {},
    { $set: { is_unlocked: false, is_found: false } }
  );
};

module.exports = {
  getPuzzles,
  solveRiddle,
  markAsFound,
  getFinalPuzzle,
  getPuzzleById,
  lockAllPuzzles
};
