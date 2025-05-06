const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Hoarding = require('../models/Hoarding');
const { auth, adminAuth } = require('../middleware/auth');

// Helper function to check for overlapping bookings
const hasOverlappingBooking = async (hoardingId, startDate, endDate) => {
  // Find any existing bookings for the same hoarding that overlap with the requested dates
  const overlappingBooking = await Booking.findOne({
    hoarding: hoardingId,
    status: { $in: ['pending', 'approved'] }, // Only check pending and approved bookings
    $or: [
      // Case 1: New booking starts during an existing booking
      {
        startDate: { $lte: startDate },
        endDate: { $gte: startDate }
      },
      // Case 2: New booking ends during an existing booking
      {
        startDate: { $lte: endDate },
        endDate: { $gte: endDate }
      },
      // Case 3: New booking completely encompasses an existing booking
      {
        startDate: { $gte: startDate },
        endDate: { $lte: endDate }
      }
    ]
  });

  return !!overlappingBooking;
};

// @route   GET /api/bookings
// @desc    Get all bookings (admin) or user's bookings
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let bookings;
    if (req.user.role === 'admin') {
      bookings = await Booking.find().populate('user', 'name email').populate('hoarding');
    } else {
      bookings = await Booking.find({ user: req.user.id }).populate('hoarding');
    }
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('hoarding');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is admin or booking owner
    if (req.user.role !== 'admin' && booking.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/bookings
// @desc    Create a booking
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { hoardingId, startDate, endDate } = req.body;

    // Check if hoarding exists and is available
    const hoarding = await Hoarding.findById(hoardingId);
    if (!hoarding) {
      return res.status(404).json({ message: 'Hoarding not found' });
    }
    if (hoarding.status !== 'available') {
      return res.status(400).json({ message: 'Hoarding is not available' });
    }

    // Create booking
    const booking = new Booking({
      user: req.user.id,
      hoarding: hoardingId,
      startDate,
      endDate,
      status: 'pending'
    });

    await booking.save();
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status (admin only)
// @access  Private/Admin
router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    // Update hoarding status if booking is approved
    if (status === 'approved') {
      await Hoarding.findByIdAndUpdate(booking.hoarding, { status: 'booked' });
    }

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Delete booking
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is admin or booking owner
    if (req.user.role !== 'admin' && booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await booking.remove();
    res.json({ message: 'Booking removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 