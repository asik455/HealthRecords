import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.post('/auth/register', userData);
      const data = response.data;
      
      // Save user to state and localStorage
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      
      return { success: true, data };
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return { success: false, error: err.response?.data?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.post('/auth/login', { email, password });
      const data = response.data;
      
      // Save user to state and localStorage
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      
      return { success: true, data };
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return { success: false, error: err.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axiosInstance.put('/auth/profile', profileData);
      const data = response.data;
      
      // Update user in state and localStorage
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      
      return { success: true, data };
    } catch (err) {
      setError(err.response?.data?.message || 'Profile update failed');
      return { success: false, error: err.response?.data?.message || 'Profile update failed' };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
