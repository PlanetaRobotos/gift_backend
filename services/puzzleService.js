// puzzleService.js
const connectToDatabase = require('../database');
const { GIFT_COLLECTION } = require('../config');

const getPuzzles = async () => {
  const db = await connectToDatabase();
  return db.collection(GIFT_COLLECTION).find({}).toArray();
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

module.exports = {
  getPuzzles,
  solveRiddle,
  markAsFound,
  getFinalPuzzle,
  getPuzzleById
};
