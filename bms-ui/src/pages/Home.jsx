import { Box, Typography, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const featuredHoardings = [
    {
      id: 1,
      title: 'Premium Billboard',
      image: 'https://via.placeholder.com/300x200',
      city: 'Mumbai',
      price: '₹50,000/month',
    },
    {
      id: 2,
      title: 'Digital Hoarding',
      image: 'https://via.placeholder.com/300x200',
      city: 'Delhi',
      price: '₹75,000/month',
    },
    {
      id: 3,
      title: 'Highway Billboard',
      image: 'https://via.placeholder.com/300x200',
      city: 'Bangalore',
      price: '₹60,000/month',
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          px: 4,
          textAlign: 'center',
          mb: 4,
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Hoarding Booking System
        </Typography>
        <Typography variant="h6" gutterBottom>
          Book premium outdoor advertising spaces across India
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          sx={{ mt: 4 }}
          onClick={() => navigate('/hoardings')}
        >
          Browse Hoardings
        </Button>
      </Box>

      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
        Featured Hoardings
      </Typography>

      <Grid container spacing={4}>
        {featuredHoardings.map((hoarding) => (
          <Grid item xs={12} sm={6} md={4} key={hoarding.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={hoarding.image}
                alt={hoarding.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {hoarding.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  City: {hoarding.city}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Price: {hoarding.price}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => navigate(`/hoardings/${hoarding.id}`)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Home; 