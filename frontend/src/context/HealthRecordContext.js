import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';
import { useAuth } from './AuthContext';

const HealthRecordContext = createContext();

export function useHealthRecord() {
  return useContext(HealthRecordContext);
}

export function HealthRecordProvider({ children }) {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all health records when user changes
  useEffect(() => {
    if (user) {
      fetchRecords();
    } else {
      setRecords([]);
      setLoading(false);
    }
  }, [user]);

  // Fetch all records
  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.get('/health-records');
      setRecords(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch health records');
      console.error('Error fetching health records:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch records by type
  const fetchRecordsByType = async (recordType) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.get(`/health-records/${recordType}`);
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || `Failed to fetch ${recordType} records`);
      return { success: false, error: err.response?.data?.message || 'Fetch failed' };
    } finally {
      setLoading(false);
    }
  };

  // Add new record
  const addRecord = async (recordData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.post('/health-records', recordData);
      
      // Update records state
      setRecords(prevRecords => [...prevRecords, response.data]);
      
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add health record');
      return { success: false, error: err.response?.data?.message || 'Add record failed' };
    } finally {
      setLoading(false);
    }
  };

  // Update record
  const updateRecord = async (id, recordData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.put(`/health-records/${id}`, recordData);
      
      // Update records state
      setRecords(prevRecords => 
        prevRecords.map(record => 
          record._id === id ? response.data : record
        )
      );
      
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update health record');
      return { success: false, error: err.response?.data?.message || 'Update record failed' };
    } finally {
      setLoading(false);
    }
  };

  // Delete record
  const deleteRecord = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await axiosInstance.delete(`/health-records/${id}`);
      
      // Update records state
      setRecords(prevRecords => 
        prevRecords.filter(record => record._id !== id)
      );
      
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete health record');
      return { success: false, error: err.response?.data?.message || 'Delete record failed' };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    records,
    loading,
    error,
    fetchRecords,
    fetchRecordsByType,
    addRecord,
    updateRecord,
    deleteRecord
  };

  return (
    <HealthRecordContext.Provider value={value}>
      {children}
    </HealthRecordContext.Provider>
  );
}
