import React from 'react';
import { Alert, Button, Container, Typography } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    // You can also log the error to an error reporting service here
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="h5" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body1" gutterBottom>
              We apologize for the inconvenience. Please try refreshing the page.
            </Typography>
            {process.env.NODE_ENV === 'development' && (
              <Typography variant="body2" sx={{ mt: 2 }}>
                Error: {this.state.error?.toString()}
              </Typography>
            )}
          </Alert>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 