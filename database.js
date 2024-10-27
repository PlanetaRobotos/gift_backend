import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;

  const client = new MongoClient(uri);
  await client.connect();
  console.log("Connected to MongoDB");
  cachedDb = client.db('GiftDatabase');
  return cachedDb;
}

export default connectToDatabase;