import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const Profile = () => {
  const { user, updateProfile, updatePassword, loading, error, message } = useAuth();
  const [tabValue, setTabValue] = useState(0);

  // Profile header with avatar
  const ProfileHeader = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
      <Avatar
        sx={{
          width: 100,
          height: 100,
          bgcolor: 'primary.main',
          mr: 2
        }}
      >
        <AccountCircleIcon sx={{ fontSize: 60 }} />
      </Avatar>
      <Box>
        <Typography variant="h5" gutterBottom>
          {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Your Profile'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.email}
        </Typography>
      </Box>
    </Box>
  );

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    address: ''
  });
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [securitySuccess, setSecuritySuccess] = useState('');
  const [securityError, setSecurityError] = useState('');
  
  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        dateOfBirth: user.dateOfBirth || '',
        gender: user.gender || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm({
      ...profileForm,
      [name]: value
    });
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityForm({
      ...securityForm,
      [name]: value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');
    setIsSubmitting(true);
    
    try {
      const result = await updateProfile(profileForm);
      if (result.success) {
        setProfileSuccess('Profile updated successfully');
      } else {
        setProfileError(result.error || 'Failed to update profile');
      }
    } catch (error) {
      setProfileError('An unexpected error occurred');
      console.error('Profile update error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSecuritySuccess('');
    setSecurityError('');
    
    // Validate password
    if (securityForm.newPassword.length < 6) {
      setSecurityError('New password must be at least 6 characters long');
      return;
    }
    
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      setSecurityError('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await updatePassword(
        securityForm.currentPassword,
        securityForm.newPassword
      );
      
      if (result.success) {
        setSecuritySuccess('Password updated successfully');
        setSecurityForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setSecurityError(result.error || 'Failed to update password');
      }
    } catch (error) {
      setSecurityError('An unexpected error occurred');
      console.error('Password update error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="page-container" sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
      <ProfileHeader />
      
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      {message && (
        <Alert severity="success" sx={{ mb: 4 }}>
          {message}
        </Alert>
      )}
      
      <Grid container spacing={4}>
        {/* Profile Info Card */}
        <Grid item xs={12} md={4}>
          <Card className="profile-card">
            <CardContent sx={{ textAlign: 'center', pb: 1 }}>
              <Avatar 
                sx={{ 
                  width: 120, 
                  height: 120, 
                  margin: '0 auto 20px', 
                  bgcolor: 'primary.main',
                  fontSize: '3rem'
                }}
              >
                {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </Avatar>
              
              <Typography variant="h5" gutterBottom>
                {user?.firstName} {user?.lastName} 
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                @{user?.username}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ textAlign: 'left' }}>
                <Box sx={{ display: 'flex', mb: 1.5 }}>
                  <Typography variant="body2" sx={{ minWidth: 100, color: 'text.secondary' }}>
                    Email:
                  </Typography>
                  <Typography variant="body2">
                    {user?.email || 'Not provided'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', mb: 1.5 }}>
                  <Typography variant="body2" sx={{ minWidth: 100, color: 'text.secondary' }}>
                    Phone:
                  </Typography>
                  <Typography variant="body2">
                    {user?.phoneNumber || 'Not provided'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', mb: 1.5 }}>
                  <Typography variant="body2" sx={{ minWidth: 100, color: 'text.secondary' }}>
                    Gender:
                  </Typography>
                  <Typography variant="body2">
                    {user?.gender || 'Not provided'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', mb: 1.5 }}>
                  <Typography variant="body2" sx={{ minWidth: 100, color: 'text.secondary' }}>
                    Birth Date:
                  </Typography>
                  <Typography variant="body2">
                    {user?.dateOfBirth || 'Not provided'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Settings Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="profile tabs"
                variant="fullWidth"
              >
                <Tab 
                  icon={<AccountCircleIcon />} 
                  label="Personal Info" 
                  id="profile-tab-0" 
                  aria-controls="profile-tabpanel-0" 
                />
                <Tab 
                  icon={<SecurityIcon />} 
                  label="Security" 
                  id="profile-tab-1" 
                  aria-controls="profile-tabpanel-1" 
                />
                <Tab 
                  icon={<SettingsBackupRestoreIcon />} 
                  label="Data & Privacy" 
                  id="profile-tab-2" 
                  aria-controls="profile-tabpanel-2" 
                />
              </Tabs>
            </Box>
            
            {/* Personal Info Tab */}
            <TabPanel value={tabValue} index={0}>
              {profileSuccess && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  {profileSuccess}
                </Alert>
              )}
              
              {profileError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {profileError}
                </Alert>
              )}
              
              <Box component="form" onSubmit={handleProfileSubmit} noValidate>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={profileForm.firstName}
                      onChange={handleProfileChange}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={profileForm.lastName}
                      onChange={handleProfileChange}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phoneNumber"
                      value={profileForm.phoneNumber}
                      onChange={handleProfileChange}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Gender"
                      name="gender"
                      value={profileForm.gender}
                      onChange={handleProfileChange}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      name="dateOfBirth"
                      type="date"
                      value={profileForm.dateOfBirth}
                      onChange={handleProfileChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      multiline
                      rows={2}
                      value={profileForm.address}
                      onChange={handleProfileChange}
                    />
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <CircularProgress size={24} /> : 'Save Changes'}
                  </Button>
                </Box>
              </Box>
            </TabPanel>
            
            {/* Security Tab */}
            <TabPanel value={tabValue} index={1}>
              {securitySuccess && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  {securitySuccess}
                </Alert>
              )}
              
              {securityError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {securityError}
                </Alert>
              )}
              
              <Box component="form" onSubmit={handlePasswordSubmit} noValidate>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      name="currentPassword"
                      type="password"
                      value={securityForm.currentPassword}
                      onChange={handleSecurityChange}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="New Password"
                      name="newPassword"
                      type="password"
                      value={securityForm.newPassword}
                      onChange={handleSecurityChange}
                      required
                      helperText="Password must be at least 6 characters long"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      name="confirmPassword"
                      type="password"
                      value={securityForm.confirmPassword}
                      onChange={handleSecurityChange}
                      required
                    />
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <CircularProgress size={24} /> : 'Update Password'}
                  </Button>
                </Box>
              </Box>
            </TabPanel>
            
            {/* Data & Privacy Tab */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom>
                Data Export
              </Typography>
              <Typography variant="body2" paragraph>
                You can download a copy of all your personal data and health records.
              </Typography>
              <Button variant="outlined" sx={{ mb: 4 }}>
                Export My Data
              </Button>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Account Deletion
              </Typography>
              <Typography variant="body2" paragraph>
                Permanently delete your account and all associated data. This action cannot be undone.
              </Typography>
              <Button variant="outlined" color="error">
                Delete My Account
              </Button>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
