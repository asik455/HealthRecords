import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Stack
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import DevicesIcon from '@mui/icons-material/Devices';
import AnalyticsIcon from '@mui/icons-material/Analytics';

const Landing = () => {
  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: '#17a2b8',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            My Health Record
          </Typography>
          
          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4 }}>
            Secure, easy, and efficient way to manage your health information
          </Typography>
          
          <Box sx={{ my: 4, textAlign: 'center' }}>
            <svg width="200" height="60" viewBox="0 0 400 100">
              <path
                className="heartbeat-pulse"
                d="M10,50 L50,50 L70,30 L90,70 L110,40 L130,60 L150,30 L170,70 L190,20 L210,80 L230,40 L250,60 L270,40 L290,70 L310,50 L350,50"
                fill="none"
                stroke="white"
                strokeWidth="3"
              />
            </svg>
          </Box>
          
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              color="secondary"
              size="large"
              sx={{ px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold' }}
            >
              Get Started
            </Button>
            
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              color="inherit"
              size="large"
              sx={{ px: 4, py: 1.5, fontSize: '1rem', borderColor: 'white', '&:hover': { borderColor: 'white' } }}
            >
              Sign In
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom fontWeight="bold">
          Features
        </Typography>
        
        <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
          Everything you need to manage your health information in one place
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }} className="health-record-card">
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                <SecurityIcon sx={{ fontSize: 80, color: 'primary.main' }} />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2" align="center">
                  Secure Storage
                </Typography>
                <Typography align="center">
                  Your health records are securely stored and encrypted. Only you have access to your personal health information.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }} className="health-record-card">
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                <DevicesIcon sx={{ fontSize: 80, color: 'primary.main' }} />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2" align="center">
                  Access Anywhere
                </Typography>
                <Typography align="center">
                  Access your health records from any device, anytime. Stay connected to your health information.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }} className="health-record-card">
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                <AnalyticsIcon sx={{ fontSize: 80, color: 'primary.main' }} />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2" align="center">
                  Health Analytics
                </Typography>
                <Typography align="center">
                  Track your health trends over time with detailed charts and visualizations to better understand your health.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h6" align="center" gutterBottom>
            My Health Record
          </Typography>
          
          <Typography variant="subtitle1" align="center" color="text.secondary" component="p">
            Empowering you to take control of your health journey
          </Typography>
          
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
            {'© '}
            {new Date().getFullYear()}
            {' My Health Record. All rights reserved.'}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
