// server/config/db.js
const mongoose = require('mongoose');

const MAX_ATTEMPTS = 5;
const RETRY_DELAY_MS = 3000;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Bad credentials won't fix themselves, so don't retry those
const isAuthError = (err) => /auth/i.test(err.message) && !/ENOTFOUND|ETIMEDOUT|ECONNREFUSED/.test(err.message);

const connectDB = async () => {
  let conn;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      conn = await mongoose.connect(
        process.env.MONGO_URI,
        { dbName: process.env.MONGO_DBNAME }
      );
      break;
    } catch (err) {
      console.error(`MongoDB connection attempt ${attempt}/${MAX_ATTEMPTS} failed: ${err.message}`);

      // Transient network/DNS failures (e.g. an SRV lookup hiccup) are retried
      if (attempt === MAX_ATTEMPTS || isAuthError(err)) {
        console.error('Could not connect to MongoDB - exiting.');
        process.exit(1);
      }

      await wait(RETRY_DELAY_MS);
    }
  }

  console.log(`MongoDB Connected: ${conn.connection.host}`);

  // Handle connection events
  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
  });

  mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
  });

  // Handle app termination
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Mongoose connection closed due to app termination');
    process.exit(0);
  });
};

module.exports = connectDB;
