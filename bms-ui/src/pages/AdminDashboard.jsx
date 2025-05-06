import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { hoardingService, bookingService } from '../services/api';
import Layout from '../components/Layout';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Tabs,
  Tab,
  Divider
} from '@mui/material';

function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [hoardings, setHoardings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('Fetching data...');
      const [hoardingsRes, bookingsRes] = await Promise.all([
        hoardingService.getAll(),
        bookingService.getAll()
      ]);
      
      console.log('Hoardings response:', hoardingsRes);
      console.log('Bookings response:', bookingsRes);
      
      if (!bookingsRes.data) {
        throw new Error('No bookings data received');
      }

      setHoardings(hoardingsRes.data);
      setBookings(bookingsRes.data);
      
      console.log('Bookings state:', bookingsRes.data);
      console.log('Pending bookings:', bookingsRes.data.filter(b => b.status === 'pending'));
    } catch (error) {
      console.error('Detailed error:', error);
      setError(error.response?.data?.message || 'Failed to fetch data. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      console.log('Updating booking status:', { bookingId, newStatus });
      await bookingService.updateStatus(bookingId, newStatus);
      console.log('Status updated successfully');
      fetchData(); // Refresh data after update
    } catch (error) {
      console.error('Error updating status:', error);
      setError(error.response?.data?.message || 'Failed to update booking status');
    }
  };

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

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const approvedBookings = bookings.filter(b => b.status === 'approved');
  const rejectedBookings = bookings.filter(b => b.status === 'rejected');

  console.log('Filtered bookings:', {
    pending: pendingBookings,
    approved: approvedBookings,
    rejected: rejectedBookings
  });

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage hoardings and bookings
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Debug Info */}
      <Alert severity="info" sx={{ mb: 3 }}>
        Total Bookings: {bookings.length} | Pending: {pendingBookings.length} | Approved: {approvedBookings.length} | Rejected: {rejectedBookings.length}
      </Alert>

      {/* Booking Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
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
              {pendingBookings.length}
            </Typography>
            {pendingBookings.length > 0 && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {pendingBookings.length} booking{pendingBookings.length > 1 ? 's' : ''} awaiting approval
              </Typography>
            )}
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
              {approvedBookings.length}
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
              bgcolor: 'error.main',
              color: 'white',
            }}
          >
            <Typography component="h2" variant="h6" gutterBottom>
              Rejected Bookings
            </Typography>
            <Typography component="p" variant="h4">
              {rejectedBookings.length}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Pending Bookings Section */}
      {pendingBookings.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Pending Bookings Requiring Action
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingBookings.map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell>{booking.user?.name || 'N/A'}</TableCell>
                    <TableCell>{booking.hoarding?.location || 'N/A'}</TableCell>
                    <TableCell>
                      {new Date(booking.startDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(booking.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Button
                          size="small"
                          color="success"
                          onClick={() => handleStatusChange(booking._id, 'approved')}
                          sx={{ mr: 1 }}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleStatusChange(booking._id, 'rejected')}
                        >
                          Reject
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="All Bookings" />
          <Tab label="Hoardings" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography color="text.secondary">
                      No bookings found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell>{booking.user?.name || 'N/A'}</TableCell>
                    <TableCell>{booking.hoarding?.location || 'N/A'}</TableCell>
                    <TableCell>
                      {new Date(booking.startDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(booking.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={booking.status.toUpperCase()}
                        color={getStatusColor(booking.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {booking.status === 'pending' && (
                        <Box>
                          <Button
                            size="small"
                            color="success"
                            onClick={() => handleStatusChange(booking._id, 'approved')}
                            sx={{ mr: 1 }}
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleStatusChange(booking._id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          {hoardings.map((hoarding) => (
            <Grid item xs={12} md={4} key={hoarding._id}>
              <Paper sx={{ p: 2 }}>
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
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    onClick={() => {/* TODO: Implement edit functionality */}}
                  >
                    Edit
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Layout>
  );
}

export default AdminDashboard; 