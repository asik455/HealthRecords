const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const HealthRecord = require('../models/HealthRecord');
const { protect } = require('../middleware/auth');

// @route   GET api/health-records
// @desc    Get all health records for a user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const healthRecords = await HealthRecord.find({ user: req.user._id }).sort({ recordDate: -1 });
    res.json(healthRecords);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/health-records/:recordType
// @desc    Get health records by type for a user
// @access  Private
router.get('/:recordType', protect, async (req, res) => {
  try {
    const { recordType } = req.params;
    const healthRecords = await HealthRecord.find({ 
      user: req.user._id,
      recordType
    }).sort({ recordDate: -1 });
    
    res.json(healthRecords);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/health-records/id/:id
// @desc    Get health record by ID
// @access  Private
router.get('/id/:id', protect, async (req, res) => {
  try {
    const healthRecord = await HealthRecord.findById(req.params.id);
    
    // Check if record exists
    if (!healthRecord) {
      return res.status(404).json({ message: 'Health record not found' });
    }
    
    // Check if user owns the record
    if (healthRecord.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to access this record' });
    }
    
    res.json(healthRecord);
  } catch (error) {
    console.error(error.message);
    
    // Check if ID is invalid
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Health record not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/health-records
// @desc    Create a new health record
// @access  Private
router.post(
  '/',
  [
    protect,
    [
      check('recordType', 'Record type is required').not().isEmpty(),
      check('recordDate', 'Record date is required').optional().isISO8601().toDate()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { 
        recordType, 
        recordDate, 
        facility,
        allergies,
        conditions,
        vitals,
        medications,
        notes
      } = req.body;

      // Create new health record
      const newHealthRecord = new HealthRecord({
        user: req.user._id,
        recordType,
        recordDate: recordDate || Date.now(),
        facility: facility || 'Healthy Family Centre',
        allergies,
        conditions,
        vitals,
        medications,
        notes
      });

      // Save health record
      const healthRecord = await newHealthRecord.save();
      res.status(201).json(healthRecord);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT api/health-records/:id
// @desc    Update a health record
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const healthRecord = await HealthRecord.findById(req.params.id);
    
    // Check if record exists
    if (!healthRecord) {
      return res.status(404).json({ message: 'Health record not found' });
    }
    
    // Check if user owns the record
    if (healthRecord.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this record' });
    }
    
    // Update fields that are sent in the request
    const updateFields = req.body;
    
    // Update record
    const updatedRecord = await HealthRecord.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );
    
    res.json(updatedRecord);
  } catch (error) {
    console.error(error.message);
    
    // Check if ID is invalid
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Health record not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/health-records/:id
// @desc    Delete a health record
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const healthRecord = await HealthRecord.findById(req.params.id);
    
    // Check if record exists
    if (!healthRecord) {
      return res.status(404).json({ message: 'Health record not found' });
    }
    
    // Check if user owns the record
    if (healthRecord.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this record' });
    }
    
    // Delete record
    await HealthRecord.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Health record removed' });
  } catch (error) {
    console.error(error.message);
    
    // Check if ID is invalid
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Health record not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
