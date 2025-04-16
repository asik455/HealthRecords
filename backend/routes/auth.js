const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret', {
    expiresIn: '30d'
  });
};

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    check('bloodGroup', 'Blood group is required').not().isEmpty(),
    check('bloodGroup', 'Invalid blood group').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, firstName, lastName, dateOfBirth, bloodGroup } = req.body;

    try {
      // Check if user already exists
      let userByEmail = await User.findOne({ email });
      if (userByEmail) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      let userByUsername = await User.findOne({ username });
      if (userByUsername) {
        return res.status(400).json({ message: 'Username is already taken' });
      }

      // Create new user
      const user = new User({
        username,
        email,
        password,
        firstName,
        lastName,
        dateOfBirth,
        bloodGroup
      });

      // Save user to database
      await user.save();

      // Return JWT token
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
        bloodGroup: user.bloodGroup,
        token: generateToken(user._id)
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   POST api/auth/login
// @desc    Login user
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Return JWT token
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
        bloodGroup: user.bloodGroup,
        token: generateToken(user._id)
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', protect, async (req, res) => {
  try {
    // Get user without returning password
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { firstName, lastName, email, phoneNumber } = req.body;

    // Update user fields if provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
      user.email = email;
    }
    if (phoneNumber) user.phoneNumber = phoneNumber;

    const updatedUser = await user.save();

    // Return user data without password
    const userResponse = {
      _id: updatedUser._id,
      username: updatedUser.username,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      bloodGroup: updatedUser.bloodGroup,
      dateOfBirth: updatedUser.dateOfBirth,
      createdAt: updatedUser.createdAt
    };

    res.json(userResponse);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// RFID Authentication
router.post('/rfid', async (req, res) => {
  try {
    const { rfidTag } = req.body;

    if (!rfidTag) {
      return res.status(400).json({ message: 'RFID tag is required' });
    }

    // Find user by RFID tag
    const user = await User.findOne({ rfidTag }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'No user found with this RFID tag' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        bloodGroup: user.bloodGroup,
        role: user.role
      }
    });
  } catch (err) {
    console.error('RFID authentication error:', err);
    res.status(500).json({ message: 'Server error during RFID authentication' });
  }
});

// Update RFID Tag
router.put('/rfid/:userId', protect, async (req, res) => {
  try {
    const { rfidTag } = req.body;
    const userId = req.params.userId;

    // Check if RFID tag is already assigned
    const existingUser = await User.findOne({ rfidTag });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(400).json({ message: 'RFID tag is already assigned to another user' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { rfidTag },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Update RFID tag error:', err);
    res.status(500).json({ message: 'Server error while updating RFID tag' });
  }
});

module.exports = router;
