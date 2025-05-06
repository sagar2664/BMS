import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/api';
import Layout from '../components/Layout';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

/**
 * Bookings Page Component
 * Displays a list of the current user's bookings with options to view details and delete bookings.
 * Includes loading states, error handling, and confirmation dialogs.
 */
function Bookings() {
  // Get current user from auth context
  const { user } = useAuth();

  // State management
  const [bookings, setBookings] = useState([]); // List of user's bookings
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [selectedBooking, setSelectedBooking] = useState(null); // Currently selected booking for details view
  const [openDialog, setOpenDialog] = useState(false); // Controls details dialog visibility
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // Controls delete confirmation dialog
  const [bookingToDelete, setBookingToDelete] = useState(null); // Booking to be deleted

  // Fetch user's bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  /**
   * Fetches the current user's bookings from the API
   * Updates the bookings state and handles any errors
   */
  const fetchBookings = async () => {
    try {
      const { data } = await bookingService.getMyBookings();
      setBookings(data);
    } catch (error) {
      setError('Failed to fetch bookings');
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Opens the details dialog for a specific booking
   * @param {Object} booking - The booking to view details for
   */
  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setOpenDialog(true);
  };

  /**
   * Closes the details dialog and clears the selected booking
   */
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBooking(null);
  };

  /**
   * Opens the delete confirmation dialog for a specific booking
   * @param {Object} booking - The booking to delete
   */
  const handleDeleteClick = (booking) => {
    setBookingToDelete(booking);
    setDeleteDialogOpen(true);
  };

  /**
   * Handles the confirmation of booking deletion
   * Makes API call to delete the booking and refreshes the list
   */
  const handleDeleteConfirm = async () => {
    try {
      await bookingService.delete(bookingToDelete._id);
      setDeleteDialogOpen(false);
      setBookingToDelete(null);
      fetchBookings(); // Refresh the bookings list
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete booking');
      console.error('Error deleting booking:', error);
    }
  };

  /**
   * Cancels the delete operation and closes the confirmation dialog
   */
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setBookingToDelete(null);
  };

  /**
   * Returns the appropriate color for the status chip based on booking status
   * @param {string} status - The booking status
   * @returns {string} The color to use for the status chip
   */
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  /**
   * Calculates the total price for a booking based on duration and daily rate
   * @param {Object} booking - The booking to calculate price for
   * @returns {number} The total price
   */
  const calculateTotalPrice = (booking) => {
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return days * booking.hoarding.price;
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Page header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Bookings
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          View and manage your hoarding bookings
        </Typography>
      </Box>

      {/* Error alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Bookings table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Location</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking._id}>
                <TableCell>{booking.hoarding.location}</TableCell>
                <TableCell>
                  {new Date(booking.startDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(booking.endDate).toLocaleDateString()}
                </TableCell>
                <TableCell>₹{calculateTotalPrice(booking)}</TableCell>
                <TableCell>
                  <Chip
                    label={booking.status.toUpperCase()}
                    color={getStatusColor(booking.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      onClick={() => handleViewDetails(booking)}
                    >
                      View Details
                    </Button>
                    <Tooltip title="Delete Booking">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(booking)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {bookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary">
                    No bookings found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Booking details dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Booking Details</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Location: {selectedBooking.hoarding.location}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Size: {selectedBooking.hoarding.size.width}m x {selectedBooking.hoarding.size.height}m
              </Typography>
              <Typography variant="body2" gutterBottom>
                Start Date: {new Date(selectedBooking.startDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" gutterBottom>
                End Date: {new Date(selectedBooking.endDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Price per day: ₹{selectedBooking.hoarding.price}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Total Price: ₹{calculateTotalPrice(selectedBooking)}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Chip
                  label={selectedBooking.status.toUpperCase()}
                  color={getStatusColor(selectedBooking.status)}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Booking</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this booking? This action cannot be undone.
          </Typography>
          {bookingToDelete && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Location: {bookingToDelete.hoarding.location}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dates: {new Date(bookingToDelete.startDate).toLocaleDateString()} - {new Date(bookingToDelete.endDate).toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}

export default Bookings; 