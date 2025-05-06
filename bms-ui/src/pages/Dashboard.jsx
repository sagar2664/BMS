import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/api';
import Layout from '../components/Layout';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Campaign as CampaignIcon,
  BookOnline as BookOnlineIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';

function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success.main';
      case 'pending':
        return 'warning.main';
      case 'rejected':
        return 'error.main';
      default:
        return 'text.secondary';
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
          Welcome, {user?.name}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Here's an overview of your bookings
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'primary.main',
              color: 'white',
            }}
          >
            <Typography component="h2" variant="h6" gutterBottom>
              Total Bookings
            </Typography>
            <Typography component="p" variant="h4">
              {bookings.length}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'success.main',
              color: 'white',
            }}
          >
            <Typography component="h2" variant="h6" gutterBottom>
              Active Bookings
            </Typography>
            <Typography component="p" variant="h4">
              {bookings.filter(b => b.status === 'approved').length}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'warning.main',
              color: 'white',
            }}
          >
            <Typography component="h2" variant="h6" gutterBottom>
              Pending Bookings
            </Typography>
            <Typography component="p" variant="h4">
              {bookings.filter(b => b.status === 'pending').length}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Recent Bookings
          </Typography>
          <Grid container spacing={2}>
            {bookings.slice(0, 3).map((booking) => (
              <Grid item xs={12} md={4} key={booking._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {booking.hoarding.location}
                    </Typography>
                    <Typography color="text.secondary" gutterBottom>
                      Size: {booking.hoarding.size.width}m x {booking.hoarding.size.height}m
                    </Typography>
                    <Typography variant="body2">
                      From: {new Date(booking.startDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">
                      To: {new Date(booking.endDate).toLocaleDateString()}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: getStatusColor(booking.status), mt: 1 }}
                    >
                      Status: {booking.status.toUpperCase()}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">View Details</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default Dashboard; 