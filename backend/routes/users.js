const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put(
  '/profile',
  protect,
  [
    check('email', 'Please include a valid email').optional().isEmail(),
    check('firstName', 'First name is required').optional().not().isEmpty(),
    check('lastName', 'Last name is required').optional().not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, firstName, lastName, dateOfBirth } = req.body;

    try {
      // Find user
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update fields
      if (email) {
        // Check if email is already in use by another user
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
          return res.status(400).json({ message: 'Email already in use' });
        }
        user.email = email;
      }
      
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (dateOfBirth) user.dateOfBirth = dateOfBirth;

      // Save updated user
      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        dateOfBirth: updatedUser.dateOfBirth
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT api/users/password
// @desc    Update user password
// @access  Private
router.put(
  '/password',
  protect,
  [
    check('currentPassword', 'Current password is required').not().isEmpty(),
    check('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    try {
      // Find user
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if current password is correct
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
