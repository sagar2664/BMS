const mongoose = require('mongoose');

// Hoarding Schema Definition
// This schema defines the structure and validation rules for hoarding documents in the database
const hoardingSchema = new mongoose.Schema({
  // Location of the hoarding
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },

  // Size of the hoarding in meters
  size: {
    width: {
      type: Number,
      required: [true, 'Width is required'],
      min: [1, 'Width must be at least 1 meter']
    },
    height: {
      type: Number,
      required: [true, 'Height is required'],
      min: [1, 'Height must be at least 1 meter']
    }
  },

  // Price per day for booking the hoarding
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },

  // Current status of the hoarding
  status: {
    type: String,
    enum: ['available', 'booked', 'maintenance'],
    default: 'available'
  },

  // Optional image URL of the hoarding
  image: {
    type: String,
    trim: true
  },

  // Optional description of the hoarding
  description: {
    type: String,
    trim: true
  },

  // Reference to the user who created the hoarding (admin)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  // Add timestamps for created and updated dates
  timestamps: true
});

// Create and export the Hoarding model
const Hoarding = mongoose.model('Hoarding', hoardingSchema);

module.exports = Hoarding; 