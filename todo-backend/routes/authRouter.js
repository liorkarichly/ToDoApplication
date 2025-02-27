const express = require('express');
const userRepository = require('../repositories/userRepository');
const { generateToken } = require('../config/auth');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * User registration.
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      logger.warn('Registration attempt for existing user', { email });
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = await userRepository.create({ email, password });
    const token = generateToken(newUser);

    logger.info('User registered', { email });

    res.status(201).json({ token });
  } catch (error) {
    logger.error('Registration failed', { error });
    res.status(500).json({ message: 'Registration failed', error });
  }
});

/**
 * User login.
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userRepository.findByEmail(email);
    if (!user || !(await user.comparePassword(password))) {
      logger.warn('Failed login attempt', { email });
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    logger.info('User logged in', { email });

    res.json({ token });
  } catch (error) {
    logger.error('Login failed', { error });
    res.status(500).json({ message: 'Login failed', error });
  }
});

module.exports = router;
