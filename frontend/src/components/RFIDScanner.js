import React, { useState, useEffect } from 'react';
import { Box, Button, CircularProgress, Alert, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RFIDScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [serialPort, setSerialPort] = useState(null);
  const navigate = useNavigate();

  const startScanning = async () => {
    try {
      setError(null);
      setIsScanning(true);

      // Request serial port access
      if ('serial' in navigator) {
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 });
        setSerialPort(port);

        // Set up the reader
        const reader = port.readable.getReader();
        
        // Read data loop
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          // Convert the received data to string
          const rfidTag = new TextDecoder().decode(value);
          
          // Authenticate with backend
          try {
            const response = await axios.post('http://localhost:5000/api/auth/rfid', {
              rfidTag: rfidTag.trim()
            });

            if (response.data.token) {
              // Store the token
              localStorage.setItem('token', response.data.token);
              
              // Navigate to medical records
              navigate(`/medical-records/${response.data.user.id}`);
              break;
            }
          } catch (err) {
            console.error('RFID authentication error:', err);
            setError('Invalid RFID tag or authentication failed');
          }
        }

        reader.releaseLock();
      } else {
        setError('Web Serial API is not supported in this browser');
      }
    } catch (err) {
      console.error('Error accessing RFID reader:', err);
      setError('Failed to connect to RFID reader');
    } finally {
      setIsScanning(false);
    }
  };

  const stopScanning = async () => {
    if (serialPort) {
      await serialPort.close();
      setSerialPort(null);
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      // Cleanup when component unmounts
      if (serialPort) {
        serialPort.close().catch(console.error);
      }
    };
  }, [serialPort]);

  return (
    <Box sx={{ mb: 4, p: 3, border: '1px solid #ddd', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        RFID Scanner
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Button
          variant="contained"
          color={isScanning ? "error" : "primary"}
          onClick={isScanning ? stopScanning : startScanning}
          disabled={isScanning}
        >
          {isScanning ? "Stop Scanning" : "Start RFID Scan"}
        </Button>

        {isScanning && (
          <CircularProgress size={24} sx={{ ml: 2 }} />
        )}
      </Box>
    </Box>
  );
};

export default RFIDScanner; 