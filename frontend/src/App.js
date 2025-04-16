import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MedicalRecords from './pages/MedicalRecords';

import Reports from './pages/Reports';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={!user ? <Landing /> : <Navigate to="/dashboard" />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/medical-records" element={<MedicalRecords />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
