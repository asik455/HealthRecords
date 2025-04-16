import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFound = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          py: 4
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 100, color: 'text.secondary', mb: 2 }} />
        
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        
        <Typography variant="h4" component="h2" gutterBottom>
          Page Not Found
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 600, mb: 4 }}>
          The page you are looking for might have been removed or is temporarily unavailable.
          Please check the URL or go back to the dashboard.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            component={RouterLink}
            to="/dashboard"
            size="large"
          >
            Go to Dashboard
          </Button>
          
          <Button
            variant="outlined"
            component={RouterLink}
            to="/"
            size="large"
          >
            Go to Home
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default NotFound;
