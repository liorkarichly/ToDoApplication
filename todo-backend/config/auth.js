const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
require('dotenv').config();
const logger = require('../utils/logger'); 

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';
logger.warn("🔹 Loaded JWT_SECRET:", JWT_SECRET); // ✅ Logs the JWT secret status (without exposing it)

/**
 * Generates a JWT token for authentication.
 * @param {Object} user - The user object.
 * @returns {string} The generated JWT token.
 */
function generateToken(user) {
  logger.info(`🔑 Generating token for user: ${user.email}`);
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
}

/**
 * Middleware to authenticate users using JWT.
 */
async function authenticateToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  
  if (!token) {
    logger.warn("🚫 Access denied: No token provided");
    return res.status(401).json({ message: 'Access denied' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    
    // Fetch user from repository
    const user = await userRepository.findById(verified.id);
    if (!user) {
      logger.warn(`❌ Unauthorized access: User not found (ID: ${verified.id})`);
      return res.status(403).json({ message: 'User not found' });
    }

    req.userId = user._id; // Attach user ID to the request
    logger.info(`✅ User authenticated: ${user.email}`);
    next();
  } catch (error) {
    logger.error("🔴 Invalid token", { error });
    res.status(403).json({ message: 'Invalid token' });
  }
}

module.exports = { generateToken, authenticateToken };
