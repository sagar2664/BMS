const express = require('express');
const router = express.Router();
const Hoarding = require('../models/Hoarding');
const { auth, adminAuth } = require('../middleware/auth');

// @route   GET /api/hoardings
// @desc    Get all hoardings
// @access  Public
router.get('/', async (req, res) => {
  try {
    const hoardings = await Hoarding.find();
    res.json(hoardings);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/hoardings/:id
// @desc    Get hoarding by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const hoarding = await Hoarding.findById(req.params.id);
    if (!hoarding) {
      return res.status(404).json({ message: 'Hoarding not found' });
    }
    res.json(hoarding);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/hoardings
// @desc    Create a hoarding
// @access  Private/Admin
router.post('/', adminAuth, async (req, res) => {
  try {
    const { location, size, price, status } = req.body;
    const hoarding = new Hoarding({
      location,
      size,
      price,
      status: status || 'available'
    });
    await hoarding.save();
    res.json(hoarding);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/hoardings/:id
// @desc    Update hoarding
// @access  Private/Admin
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { location, size, price, status } = req.body;
    const hoarding = await Hoarding.findById(req.params.id);
    
    if (!hoarding) {
      return res.status(404).json({ message: 'Hoarding not found' });
    }

    hoarding.location = location || hoarding.location;
    hoarding.size = size || hoarding.size;
    hoarding.price = price || hoarding.price;
    hoarding.status = status || hoarding.status;

    await hoarding.save();
    res.json(hoarding);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/hoardings/:id
// @desc    Delete hoarding
// @access  Private/Admin
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const hoarding = await Hoarding.findById(req.params.id);
    
    if (!hoarding) {
      return res.status(404).json({ message: 'Hoarding not found' });
    }

    await hoarding.remove();
    res.json({ message: 'Hoarding removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 