const express = require('express');
const userRepository = require('../repositories/userRepository');
const { generateToken } = require('../config/auth');

const router = express.Router();

/**
 * User registration.
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      logger.warn("Registration failed: Email already exists", { email });
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = await userRepository.create({ email, password });
    logger.info("User registered successfully", { email });
    // Generate a JWT token for the new user
    const token = generateToken(newUser);

    res.status(201).json({ token });
  } catch (error) {
    logger.error("Registration error", { error });
    res.status(500).json({ message: 'Registration failed', error });
  }
});

/**
 * User login.
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await userRepository.findByEmail(email);
    if (!user || !(await user.comparePassword(password))) {
      logger.warn("Login failed: User not found", { email });
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user);
    logger.info("User logged in", { email });

    res.json({ token });
  } catch (error) {
    logger.error("Login error", { error });
    res.status(500).json({ message: 'Login failed', error });
  }
});

module.exports = router;
