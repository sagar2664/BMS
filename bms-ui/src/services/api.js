import axios from 'axios';

// Base URL for all API requests
const API_URL = 'http://localhost:5000/api';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authentication token to all requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    // If token exists, add it to request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication service methods
export const authService = {
  // Register a new user
  register: (userData) => api.post('/auth/register', userData),
  // Login existing user
  login: (credentials) => api.post('/auth/login', credentials),
  // Get current user's profile
  getCurrentUser: () => api.get('/auth/me'),
};

// Hoarding service methods
export const hoardingService = {
  // Get all hoardings
  getAll: () => api.get('/hoardings'),
  // Get a specific hoarding by ID
  getById: (id) => api.get(`/hoardings/${id}`),
  // Create a new hoarding (admin only)
  create: (hoardingData) => api.post('/hoardings', hoardingData),
  // Update an existing hoarding (admin only)
  update: (id, hoardingData) => api.put(`/hoardings/${id}`, hoardingData),
  // Delete a hoarding (admin only)
  delete: (id) => api.delete(`/hoardings/${id}`),
};

// Booking service methods
export const bookingService = {
  // Get all bookings (admin only)
  getAll: () => api.get('/bookings'),
  // Get current user's bookings
  getMyBookings: () => api.get('/bookings/my-bookings'),
  // Create a new booking
  create: (bookingData) => api.post('/bookings', bookingData),
  // Update booking status (admin only)
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
  // Update booking payment status
  updatePayment: (id, paymentData) => api.put(`/bookings/${id}/payment`, paymentData),
  // Delete a booking
  delete: (id) => api.delete(`/bookings/${id}`),
};

// Export the configured axios instance
export default api; 