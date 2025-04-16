import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { HealthRecordProvider } from './context/HealthRecordContext';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#17a2b8',
      light: '#4dd5ea',
      dark: '#007288',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6c757d',
      light: '#9ba0a5',
      dark: '#40484f',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    success: {
      main: '#28a745',
    },
    error: {
      main: '#dc3545',
    },
    warning: {
      main: '#ffc107',
    },
    info: {
      main: '#17a2b8',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <HealthRecordProvider>
            <App />
          </HealthRecordProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
