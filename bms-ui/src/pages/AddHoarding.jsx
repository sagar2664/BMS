import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
  Grid,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  imageUrl: yup.string().url('Invalid URL').required('Image URL is required'),
  city: yup.string().required('City is required'),
  price: yup
    .number()
    .typeError('Price must be a number')
    .positive('Price must be positive')
    .required('Price is required'),
  size: yup.string().required('Size is required'),
});

function AddHoarding() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      // TODO: Implement actual API call to add hoarding
      console.log('Hoarding data:', data);
      // For now, just navigate to hoardings page
      navigate('/hoardings');
    } catch (err) {
      setError(err.message || 'An error occurred while adding the hoarding');
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Add New Hoarding
        </Typography>
        {error && (
          <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
            {error}
          </Alert>
        )}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 3, width: '100%' }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="title"
                label="Hoarding Title"
                {...register('title')}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="imageUrl"
                label="Image URL"
                {...register('imageUrl')}
                error={!!errors.imageUrl}
                helperText={errors.imageUrl?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="city"
                label="City"
                {...register('city')}
                error={!!errors.city}
                helperText={errors.city?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="price"
                label="Price (₹/month)"
                type="number"
                {...register('price')}
                error={!!errors.price}
                helperText={errors.price?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="size"
                label="Size (e.g., 20x10 ft)"
                {...register('size')}
                error={!!errors.size}
                helperText={errors.size?.message}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/hoardings')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
            >
              Add Hoarding
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default AddHoarding; 