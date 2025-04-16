import React, { useEffect, useState } from 'react';
import { useHealthRecord } from '../context/HealthRecordContext';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { format } from 'date-fns';

const MedicalRecords = () => {
  const { records, loading, error, fetchRecords, addRecord, updateRecord, deleteRecord } = useHealthRecord();
  const [currentTab, setCurrentTab] = useState(0);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [formData, setFormData] = useState({
    recordType: 'Allergies',
    facility: 'Healthy Family Centre',
    allergies: [{ name: '', severity: 'Mild' }],
    conditions: [{ name: '', status: '', details: '' }],
    notes: ''
  });

  // Record types
  const recordTypes = ['Allergies', 'Health Issues', 'Diagnoses'];
  const severityOptions = ['Mild', 'Moderate', 'Severe'];

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    if (records) {
      filterRecordsByType(recordTypes[currentTab]);
    }
  }, [records, currentTab]);

  const filterRecordsByType = (recordType) => {
    const filtered = records.filter(record => record.recordType === recordType);
    setFilteredRecords(filtered);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleDialogOpen = (record = null) => {
    if (record) {
      // Edit existing record
      setIsEditing(true);
      setCurrentRecord(record);
      setFormData({
        recordType: record.recordType,
        facility: record.facility || 'Healthy Family Centre',
        allergies: record.allergies && record.allergies.length > 0 ? record.allergies : [{ name: '', severity: 'Mild' }],
        conditions: record.conditions && record.conditions.length > 0 ? record.conditions : [{ name: '', status: '', details: '' }],
        notes: record.notes || ''
      });
    } else {
      // New record
      setIsEditing(false);
      setCurrentRecord(null);
      setFormData({
        recordType: recordTypes[currentTab],
        facility: 'Healthy Family Centre',
        allergies: [{ name: '', severity: 'Mild' }],
        conditions: [{ name: '', status: '', details: '' }],
        notes: ''
      });
    }
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setFormData({
      recordType: recordTypes[currentTab],
      facility: 'Healthy Family Centre',
      allergies: [{ name: '', severity: 'Mild' }],
      conditions: [{ name: '', status: '', details: '' }],
      notes: ''
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      recordType: formData.recordType,
      facility: formData.facility,
      recordDate: new Date().toISOString(),
      notes: formData.notes
    };

    if (formData.recordType === 'Allergies') {
      // For Allergies
      // Filter out empty allergies
      const validAllergies = formData.allergies.filter(allergy => allergy.name.trim() !== '');
      if (validAllergies.length === 0) {
        alert('Please add at least one allergy');
        return;
      }
      payload.allergies = validAllergies;
    } else {
      // For Health Issues and Diagnoses
      // Filter out empty conditions
      const validConditions = formData.conditions.filter(condition => condition.name.trim() !== '');
      if (validConditions.length === 0) {
        alert('Please add at least one condition');
        return;
      }
      payload.conditions = validConditions;
    }

    if (isEditing && currentRecord) {
      await updateRecord(currentRecord._id, payload);
    } else {
      await addRecord(payload);
    }

    handleDialogClose();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      const result = await deleteRecord(id);
      if (result.success) {
        // After successful deletion, refresh the records
        await fetchRecords();
      }
    }
  };

  if (loading && records.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Medical Records
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          {recordTypes.map((type, index) => (
            <Tab key={index} label={type} />
          ))}
        </Tabs>
      </Box>

      {filteredRecords.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="h6" color="text.secondary">
            No {recordTypes[currentTab]} records found
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleDialogOpen()}
            sx={{ mt: 2 }}
          >
            Add {recordTypes[currentTab]} Record
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredRecords.map((record) => (
            <Grid item xs={12} key={record._id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h6">
                        {format(new Date(record.recordDate), 'EEEE, dd MMMM yyyy')}
                      </Typography>
                      <Typography variant="body2" className="record-facility">
                        {record.facility}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton 
                        aria-label="edit"
                        onClick={() => handleDialogOpen(record)}
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        aria-label="delete"
                        onClick={() => handleDelete(record._id)}
                        size="small"
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  {record.recordType === 'Allergies' && record.allergies && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Allergies:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {record.allergies.map((allergy, index) => (
                          <Chip
                            key={index}
                            label={`${allergy.name} (${allergy.severity})`}
                            color={
                              allergy.severity === 'Severe' ? 'error' :
                              allergy.severity === 'Moderate' ? 'warning' : 'success'
                            }
                            size="small"
                            sx={{ mb: 1 }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                  
                  {(record.recordType === 'Health Issues' || record.recordType === 'Diagnoses') && record.conditions && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        {record.recordType === 'Health Issues' ? 'Health Issues:' : 'Diagnoses:'}
                      </Typography>
                      <Grid container spacing={2}>
                        {record.conditions.map((condition, index) => (
                          <Grid item xs={12} key={index}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Typography variant="body1" component="span" sx={{ fontWeight: 'medium' }}>
                                {condition.name}
                              </Typography>
                              {condition.status && (
                                <Chip
                                  label={condition.status}
                                  size="small"
                                  color={condition.status === 'Active' ? 'error' : 'success'}
                                  sx={{ ml: 1 }}
                                />
                              )}
                            </Box>
                            {condition.details && (
                              <Typography variant="body2" color="text.secondary">
                                {condition.details}
                              </Typography>
                            )}
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}

                  {record.notes && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Notes:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {record.notes}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {isEditing ? `Edit ${formData.recordType} Record` : `Add New ${recordTypes[currentTab]} Record`}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Record Type</InputLabel>
                  <Select
                    name="recordType"
                    value={formData.recordType}
                    onChange={handleFormChange}
                    label="Record Type"
                  >
                    {recordTypes.map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Facility"
                  name="facility"
                  value={formData.facility}
                  onChange={handleFormChange}
                />
              </Grid>

              {formData.recordType === 'Allergies' && (
                <Grid item xs={12}>
                  {formData.allergies.map((allergy, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <TextField
                        fullWidth
                        label="Allergy Name"
                        value={allergy.name}
                        onChange={(e) => {
                          const newAllergies = [...formData.allergies];
                          newAllergies[index].name = e.target.value;
                          setFormData(prev => ({ ...prev, allergies: newAllergies }));
                        }}
                      />
                      <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Severity</InputLabel>
                        <Select
                          value={allergy.severity}
                          label="Severity"
                          onChange={(e) => {
                            const newAllergies = [...formData.allergies];
                            newAllergies[index].severity = e.target.value;
                            setFormData(prev => ({ ...prev, allergies: newAllergies }));
                          }}
                        >
                          {severityOptions.map((option) => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Button
                        color="error"
                        onClick={() => {
                          const newAllergies = formData.allergies.filter((_, i) => i !== index);
                          setFormData(prev => ({ ...prev, allergies: newAllergies }));
                        }}
                      >
                        Remove
                      </Button>
                    </Box>
                  ))}
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        allergies: [...prev.allergies, { name: '', severity: 'Mild' }]
                      }));
                    }}
                  >
                    Add Allergy
                  </Button>
                </Grid>
              )}

              {(formData.recordType === 'Health Issues' || formData.recordType === 'Diagnoses') && (
                <Grid item xs={12}>
                  {formData.conditions.map((condition, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label={`${formData.recordType === 'Health Issues' ? 'Issue' : 'Diagnosis'} Name`}
                            value={condition.name}
                            onChange={(e) => {
                              const newConditions = [...formData.conditions];
                              newConditions[index].name = e.target.value;
                              setFormData(prev => ({ ...prev, conditions: newConditions }));
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                              value={condition.status}
                              label="Status"
                              onChange={(e) => {
                                const newConditions = [...formData.conditions];
                                newConditions[index].status = e.target.value;
                                setFormData(prev => ({ ...prev, conditions: newConditions }));
                              }}
                            >
                              <MenuItem value="Active">Active</MenuItem>
                              <MenuItem value="Resolved">Resolved</MenuItem>
                              <MenuItem value="Ongoing">Ongoing</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            multiline
                            rows={2}
                            label="Details"
                            value={condition.details}
                            onChange={(e) => {
                              const newConditions = [...formData.conditions];
                              newConditions[index].details = e.target.value;
                              setFormData(prev => ({ ...prev, conditions: newConditions }));
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            color="error"
                            onClick={() => {
                              const newConditions = formData.conditions.filter((_, i) => i !== index);
                              setFormData(prev => ({ ...prev, conditions: newConditions }));
                            }}
                          >
                            Remove
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        conditions: [...prev.conditions, { name: '', status: '', details: '' }]
                      }));
                    }}
                  >
                    Add {formData.recordType === 'Health Issues' ? 'Issue' : 'Diagnosis'}
                  </Button>
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleFormChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {isEditing ? 'Update' : 'Add'} Record
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default MedicalRecords;
