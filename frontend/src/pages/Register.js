import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Grid,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    bloodGroup: ''
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.username || !formData.email || !formData.password || !formData.bloodGroup) {
      setFormError('Username, email, password, and blood group are required');
      return;
    }
    
    if (!validateEmail(formData.email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return;
    }

    if (!bloodGroups.includes(formData.bloodGroup)) {
      setFormError('Please select a valid blood group');
      return;
    }
    
    setIsSubmitting(true);
    setFormError('');
    
    try {
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        bloodGroup: formData.bloodGroup
      });
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setFormError(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setFormError(error.response?.data?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: 'auto',
        p: 3,
        mt: 4
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Register
      </Typography>

      {formError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {formError}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="username"
              label="Username"
              value={formData.username}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="firstName"
              label="First Name"
              value={formData.firstName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Blood Group</InputLabel>
              <Select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                label="Blood Group"
              >
                {bloodGroups.map((group) => (
                  <MenuItem key={group} value={group}>
                    {group}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              helperText="Password must be at least 6 characters long"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              sx={{ mt: 2 }}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Register'}
            </Button>
          </Grid>
        </Grid>
      </form>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Link component={RouterLink} to="/login">
          Already have an account? Login
        </Link>
      </Box>
    </Box>
  );
};

export default Register;
