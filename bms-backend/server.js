// Import required dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { apiLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/error');

// Load environment variables from .env file
dotenv.config();

// Create Express application instance
const app = express();

// CORS Configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Add your frontend URLs
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Middleware Configuration
// Parse JSON request bodies
app.use(express.json());
// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to all routes
app.use(apiLimiter);

// Database Connection
// Connect to MongoDB using the connection string from environment variables
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
// Mount different route handlers for different resources
app.use('/api/auth', require('./routes/auth'));      // Authentication routes (login, register)
app.use('/api/users', require('./routes/users'));    // User management routes
app.use('/api/hoardings', require('./routes/hoardings')); // Hoarding management routes
app.use('/api/bookings', require('./routes/bookings'));   // Booking management routes

// Error Handling Middleware
// Global error handler for unhandled errors
app.use(errorHandler);

// Start Server
// Listen on the specified port from environment variables, defaulting to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 