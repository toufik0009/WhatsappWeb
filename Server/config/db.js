// backend/db.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
let db;

async function connectDB() {
  await client.connect();
  db = client.db('whatsapp');
  return db;
}

function getDB() {
  return db;
}

module.exports = { connectDB, getDB };