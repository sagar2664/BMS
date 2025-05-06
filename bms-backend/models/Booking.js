const mongoose = require('mongoose');

// Booking Schema Definition
// This schema defines the structure and validation rules for booking documents in the database
const bookingSchema = new mongoose.Schema({
  // Reference to the hoarding being booked
  hoarding: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hoarding',
    required: [true, 'Hoarding reference is required']
  },

  // Reference to the user making the booking
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },

  // Start date of the booking
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Start date must be in the future'
    }
  },

  // End date of the booking
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },

  // Current status of the booking
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  // Total amount for the booking (calculated based on duration and hoarding price)
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },

  // Payment status of the booking
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },

  // Payment details (optional)
  paymentDetails: {
    transactionId: String,
    paymentMethod: String,
    paymentDate: Date
  }
}, {
  // Add timestamps for created and updated dates
  timestamps: true
});

// Pre-save middleware to calculate total amount
bookingSchema.pre('save', async function(next) {
  if (this.isModified('startDate') || this.isModified('endDate')) {
    const hoarding = await this.model('Hoarding').findById(this.hoarding);
    if (hoarding) {
      const duration = Math.ceil(
        (this.endDate - this.startDate) / (1000 * 60 * 60 * 24)
      );
      this.totalAmount = duration * hoarding.price;
    }
  }
  next();
});

// Create and export the Booking model
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking; 