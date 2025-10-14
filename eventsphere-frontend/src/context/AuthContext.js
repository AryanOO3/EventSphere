import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { addNotification, createWelcomeNotification, createLoginEventsNotification } from '../utils/notifications';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      const userData = JSON.parse(user);
      setCurrentUser(userData);

    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      
      // Update last login time
      try {
        await api.put('/auth/update-login');
      } catch (loginUpdateError) {

      }
      
      // Add welcome notification on login
      addNotification(createWelcomeNotification(user.name));
      
      // Check for upcoming events and notify
      try {
        const eventsResponse = await api.get('/events');
        const upcomingEvents = eventsResponse.data.events.filter(event => {
          const eventDate = new Date(event.date);
          const now = new Date();
          const daysDiff = (eventDate - now) / (1000 * 60 * 60 * 24);
          return daysDiff >= 0 && daysDiff <= 7; // Events in next 7 days
        });
        

        if (upcomingEvents.length > 0) {
          addNotification(createLoginEventsNotification(upcomingEvents.length));
        }
      } catch (eventError) {

      }
      
      // Force notification bell update
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('notificationAdded'));
      }, 100);
      
      return user;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed - Check if backend server is running');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await axios.post('http://localhost:5000/api/auth/register', userData);
      
      if (response.data.token && response.data.user) {
        setCurrentUser(response.data.user);
      }
      
      return response.data;
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.error || 'Registration failed - Check if backend server is running');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const refreshUser = async () => {
    try {
      const response = await api.get('/user/profile');
      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Failed to refresh user:', error);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, loading, error, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};