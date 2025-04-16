import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Checkbox,
  FormControlLabel,
  Alert,
  CircularProgress,
  Container,
  Divider
} from '@mui/material';
import RFIDScanner from '../components/RFIDScanner';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rememberMe' ? checked : value
    });
    setFormError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.email || !formData.password) {
      setFormError('Email and password are required');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    setFormError('');
    
    try {
      const { success, error } = await login(formData.email, formData.password);
      
      if (success) {
        // Save to localStorage if rememberMe is checked
        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        navigate('/dashboard');
      } else {
        setFormError(error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setFormError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Login
        </Typography>

        <RFIDScanner />

        <Divider sx={{ width: '100%', my: 3 }}>
          <Typography color="textSecondary">OR</Typography>
        </Divider>

        {formError && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {formError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            type="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            error={!!formError && !formData.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            error={!!formError && !formData.password}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="rememberMe"
                color="primary"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
            }
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Login'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link component={RouterLink} to="/register" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
