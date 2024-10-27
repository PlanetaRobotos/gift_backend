const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb+srv://mirskiyp2002:zpuOpITjjkbVV49o@cluster0.y4hol.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

let db;

async function connectToDatabase() {
  if (db) return db; // reuse existing connection

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  db = client.db('GiftDatabase'); // Replace 'myDatabase' with your desired database name
  return db;
}

module.exports = connectToDatabase;