// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Handle mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => error.message);
    return res.status(400).json({
      message: 'Validation Error',
      errors
    });
  }

  // Handle mongoose duplicate key errors
  if (err.code === 11000) {
    return res.status(400).json({
      message: 'Duplicate field value entered',
      field: Object.keys(err.keyValue)[0]
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expired'
    });
  }

  // Handle custom errors
  if (err.status) {
    return res.status(err.status).json({
      message: err.message
    });
  }

  // Default error
  res.status(500).json({
    message: 'Something went wrong',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

module.exports = errorHandler; 