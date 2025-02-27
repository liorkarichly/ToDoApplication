const jwt = require('jsonwebtoken');
require('dotenv').config();
const logger = require('../utils/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

/**
 * checkAuth
 * Middleware to validate JWT and attach user ID to the request.
 */
exports.checkAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Expecting format: Authorization: Bearer <token>
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn("🚫 No token provided in request");
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract token
    const decoded = jwt.verify(token, JWT_SECRET);

    // ✅ FIXED: Ensure we're correctly assigning `decoded.id` instead of `decoded.userId`
    req.userId = decoded.id;
    logger.info(`🔑 Token verified successfully for user ID: ${req.userId}`);

    next();
  } catch (error) {
    logger.error("🔴 JWT Verification Failed", { error: error.message });
    return res.status(401).json({ message: 'Invalid token', error });
  }
};
