const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGO_URI);
let db;

async function connectDB() {
  try {
    // await client.connect();
    db = client.db("building_management");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
}

function getDB() {
  return db;
}

module.exports = { connectDB, getDB };
