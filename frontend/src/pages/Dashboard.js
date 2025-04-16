import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHealthRecord } from '../context/HealthRecordContext';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import AddIcon from '@mui/icons-material/Add';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';

const Dashboard = () => {
  const { user } = useAuth();
  const { records, loading, error, fetchRecords } = useHealthRecord();
  const [stats, setStats] = useState({
    allergies: 0,
    diagnoses: 0,
    vitals: 0,
  });

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  useEffect(() => {
    if (records.length > 0) {
      const allergiesCount = records.filter(record => record.recordType === 'Allergies').length;
      const diagnosesCount = records.filter(record => record.recordType === 'Diagnoses').length;
      const vitalsCount = records.filter(record => record.recordType === 'Vitals').length;
      
      setStats({
        allergies: allergiesCount,
        diagnoses: diagnosesCount,
        vitals: vitalsCount
      });
    }
  }, [records]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="page-container">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user.firstName || user.username}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Your health dashboard provides a quick overview of your health information
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <BloodtypeIcon color="error" sx={{ mr: 1 }} />
          <Chip 
            label={`Blood Group: ${user.bloodGroup}`}
            color="error"
            variant="outlined"
            sx={{ fontWeight: 'bold' }}
          />
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              borderLeft: '4px solid #F44336', 
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}
            className="dashboard-stat-card"
          >
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                ALLERGIES
              </Typography>
              <Typography variant="h4" component="div">
                {stats.allergies}
              </Typography>
              <Button 
                component={RouterLink}
                to="/medical-records"
                size="small" 
                sx={{ mt: 1 }}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              borderLeft: '4px solid #2196F3', 
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}
            className="dashboard-stat-card"
          >
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                DIAGNOSES
              </Typography>
              <Typography variant="h4" component="div">
                {stats.diagnoses}
              </Typography>
              <Button 
                component={RouterLink}
                to="/medical-records"
                size="small" 
                sx={{ mt: 1 }}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              borderLeft: '4px solid #4CAF50', 
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}
            className="dashboard-stat-card"
          >
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                VITALS RECORDED
              </Typography>
              <Typography variant="h4" component="div">
                {stats.vitals}
              </Typography>
              <Button 
                component={RouterLink}
                to="/charts"
                size="small" 
                sx={{ mt: 1 }}
              >
                View Charts
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h5" component="h2" gutterBottom className="section-title">
        Quick Actions
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }} className="health-record-card">
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <MedicalInformationIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Medical Records
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                View and manage your health records and medical information
              </Typography>
              <Button
                component={RouterLink}
                to="/medical-records"
                variant="contained"
                startIcon={<AddIcon />}
              >
                Add Record
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }} className="health-record-card">
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <BarChartIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Charts & Analytics
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Visualize your health data with interactive charts and graphs
              </Typography>
              <Button
                component={RouterLink}
                to="/charts"
                variant="contained"
              >
                View Charts
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }} className="health-record-card">
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <DescriptionIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Health Reports
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Access and download detailed reports of your health records
              </Typography>
              <Button
                component={RouterLink}
                to="/reports"
                variant="contained"
              >
                View Reports
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
