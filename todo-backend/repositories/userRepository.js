const User = require('../models/userModel');
const logger = require('../utils/logger');

class UserRepository {
  /**
   * Find a user by email.
   * @param {string} email - The user's email.
   * @returns {Object} User object or null.
   */
  async findByEmail(email) {
    try {
      const user = await User.findOne({ email });
      if (!user) logger.warn(`⚠️ User not found for email: ${email}`);
      return user;
    } catch (error) {
      logger.error("❌ Error retrieving user by email", { email, error });
      throw error;
    }
  }

  /**
   * Find a user by ID.
   * @param {string} id - The user's ID.
   * @returns {Object} User object or null.
   */
  async findById(id) {
    try {
      const user = await User.findById(id);
      if (!user) logger.warn(`⚠️ User not found for ID: ${id}`);
      return user;
    } catch (error) {
      logger.error("❌ Error retrieving user by ID", { id, error });
      throw error;
    }
  }

  /**
   * Create a new user.
   * @param {Object} userData - User details (email, password).
   * @returns {Object} Created User object.
   */
  async create(userData) {
    try {
      const newUser = new User(userData);
      const savedUser = await newUser.save();
      logger.info("✅ User registered successfully", { email: savedUser.email });
      return savedUser;
    } catch (error) {
      logger.error("❌ Error creating user", { error });
      throw error;
    }
  }
}

module.exports = new UserRepository();
