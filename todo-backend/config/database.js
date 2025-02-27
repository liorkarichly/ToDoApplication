/**
 * config/database.js
 * This file handles the connection to MongoDB using Mongoose.
 */
const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * connectDB
 * Connects to MongoDB using the provided connection string.
 * @param {string} connectionString - MongoDB connection string.
 */
async function connectDB(connectionString) {
  try {
    await mongoose.connect(connectionString);
    logger.info('✅ Connected to MongoDB successfully.');
  } catch (error) {
    logger.error('🔴 Failed to connect to MongoDB:', { error });
    process.exit(1); // Exit process with failure
  }
}

module.exports = { connectDB };
