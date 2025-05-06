import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hoardingService, bookingService } from '../services/api';
import Layout from '../components/Layout';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

function Hoardings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hoardings, setHoardings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHoarding, setSelectedHoarding] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bookingError, setBookingError] = useState(null);

  useEffect(() => {
    fetchHoardings();
  }, []);

  const fetchHoardings = async () => {
    try {
      const { data } = await hoardingService.getAll();
      setHoardings(data);
    } catch (error) {
      setError('Failed to fetch hoardings');
      console.error('Error fetching hoardings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingClick = (hoarding) => {
    setSelectedHoarding(hoarding);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedHoarding(null);
    setStartDate(null);
    setEndDate(null);
    setBookingError(null);
  };

  const handleBookingSubmit = async () => {
    if (!startDate || !endDate) {
      setBookingError('Please select both start and end dates');
      return;
    }

    // Validate dates
    if (startDate >= endDate) {
      setBookingError('End date must be after start date');
      return;
    }

    // Check if dates are in the past
    const now = new Date();
    if (startDate < now) {
      setBookingError('Start date cannot be in the past');
      return;
    }

    try {
      await bookingService.create({
        hoardingId: selectedHoarding._id,
        startDate,
        endDate
      });
      handleCloseDialog();
      navigate('/bookings');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create booking';
      setBookingError(errorMessage);
      console.error('Booking error:', error);
    }
  };

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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Available Hoardings
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Browse and book available hoarding spaces
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {hoardings.map((hoarding) => (
          <Grid item xs={12} md={4} key={hoarding._id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={hoarding.image || 'https://via.placeholder.com/300x200'}
                alt={hoarding.location}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {hoarding.location}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  Size: {hoarding.size.width}m x {hoarding.size.height}m
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Price: ₹{hoarding.price}/day
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Chip
                    label={hoarding.status === 'available' ? 'Available' : 'Booked'}
                    color={hoarding.status === 'available' ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
              </CardContent>
              <Box sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="contained"
                  fullWidth
                  disabled={hoarding.status !== 'available'}
                  onClick={() => handleBookingClick(hoarding)}
                >
                  Book Now
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Book Hoarding</DialogTitle>
        <DialogContent>
          {bookingError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {bookingError}
            </Alert>
          )}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {selectedHoarding?.location}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Size: {selectedHoarding?.size.width}m x {selectedHoarding?.size.height}m
            </Typography>
            <Typography variant="body2" gutterBottom>
              Price: ₹{selectedHoarding?.price}/day
            </Typography>
          </Box>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ mt: 3 }}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 2 }} />}
                minDate={new Date()}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={setEndDate}
                renderInput={(params) => <TextField {...params} fullWidth />}
                minDate={startDate || new Date()}
              />
            </Box>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleBookingSubmit} variant="contained">
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}

export default Hoardings; 