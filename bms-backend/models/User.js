const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema Definition
// This schema defines the structure and validation rules for user documents in the database
const userSchema = new mongoose.Schema({
  // User's full name
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },

  // User's email address (used for login)
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },

  // User's password (hashed before saving)
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },

  // User's role in the system (user or admin)
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  // User's phone number (optional)
  phone: {
    type: String,
    trim: true
  },

  // User's address (optional)
  address: {
    type: String,
    trim: true
  }
}, {
  // Add timestamps for created and updated dates
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User; 