const { MongoClient } = require('mongodb');

const { MONGODB_URI, GIFT_COLLECTION } = require('./config');

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  console.log("Connected to MongoDB");
  cachedDb = client.db(GIFT_COLLECTION);
  return cachedDb;
}

module.exports = connectToDatabase;
