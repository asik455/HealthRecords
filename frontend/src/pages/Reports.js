import React, { useState, useEffect, useRef } from 'react';
import { useHealthRecord } from '../context/HealthRecordContext';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,

  Snackbar,
  Divider
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';

import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Reports = () => {
  const { records, loading, error, fetchRecords } = useHealthRecord();
  const [reportType, setReportType] = useState('all');
  const [generatingReport, setGeneratingReport] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const reportRef = useRef(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
  };

  const handleGenerateReport = () => {
    setGeneratingReport(true);
    setTimeout(() => {
      setGeneratingReport(false);
    }, 1500);
  };

  const generateReportData = () => {
    if (!records || records.length === 0) {
      return [];
    }

    let filteredRecords = [...records];
    
    if (reportType !== 'all') {
      filteredRecords = records.filter(record => record.recordType === reportType);
    }
    
    filteredRecords.sort((a, b) => new Date(b.recordDate) - new Date(a.recordDate));
    return filteredRecords;
  };

  const downloadPDF = async () => {
    try {
      setGeneratingReport(true);
      
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'px', 'a4');

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
      const imgX = (pageWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`health-records-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      
      setSnackbarMessage('PDF downloaded successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setSnackbarMessage('Error generating PDF. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setGeneratingReport(false);
    }
  };



  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const reportData = generateReportData();

  if (loading && records.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="page-container">
      <Typography variant="h4" component="h1" gutterBottom>
        Health Reports
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Generate Health Report
          </Typography>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel id="report-type-label">Report Type</InputLabel>
                <Select
                  labelId="report-type-label"
                  id="report-type"
                  value={reportType}
                  label="Report Type"
                  onChange={handleReportTypeChange}
                >
                  <MenuItem value="all">All Records</MenuItem>
                  <MenuItem value="Allergies">Allergies</MenuItem>
                  <MenuItem value="Health Issues">Health Issues</MenuItem>
                  <MenuItem value="Diagnoses">Diagnoses</MenuItem>
                  <MenuItem value="Vitals">Vitals</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={8}>
              <Button
                variant="contained"
                onClick={handleGenerateReport}
                disabled={generatingReport}
                sx={{ mr: 2 }}
              >
                {generatingReport ? <CircularProgress size={24} /> : 'Generate Report'}
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                disabled={generatingReport}
                onClick={() => window.print()}
              >
                Print
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      <div ref={reportRef}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Report Preview
        </Typography>
        
        {reportData.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No records available for the selected report type
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="health records table">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Facility</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.map((record) => (
                  <TableRow
                    key={record._id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {format(new Date(record.recordDate), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>{record.recordType}</TableCell>
                    <TableCell>{record.facility}</TableCell>
                    <TableCell>
                      {record.recordType === 'Allergies' && record.allergies && (
                        <span>
                          {record.allergies.map(a => `${a.name} (${a.severity})`).join(', ')}
                        </span>
                      )}
                      
                      {(record.recordType === 'Health Issues' || record.recordType === 'Diagnoses') && record.conditions && (
                        <span>
                          {record.conditions.map(c => `${c.name}${c.status ? ` - ${c.status}` : ''}`).join(', ')}
                        </span>
                      )}
                      
                      {record.notes && (
                        <Typography variant="body2" color="text.secondary">
                          Note: {record.notes}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          disabled={reportData.length === 0 || generatingReport}
          onClick={downloadPDF}
          sx={{ mr: 1 }}
        >
          {generatingReport ? <CircularProgress size={20} /> : 'Download PDF'}
        </Button>
        

      </Box>
      
      <Divider sx={{ my: 4 }} />
      
      <Typography variant="h6" gutterBottom>
        Available Report Templates
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Complete Health Summary
              </Typography>
              <Typography variant="body2" color="text.secondary">
                A comprehensive report of all your health records including allergies, 
                diagnoses, medications, and vitals.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Generate</Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Medication Report
              </Typography>
              <Typography variant="body2" color="text.secondary">
                A detailed report of all your current and past medications, 
                including dosage and frequency.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Generate</Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Vitals History
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track changes in your vital signs over time, including blood pressure, 
                temperature, and heart rate.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Generate</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>



      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default Reports;
