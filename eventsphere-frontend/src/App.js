import React, { useContext, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import Profile from './pages/Profile';
import Events from './pages/Events';
import AdminPanel from './pages/AdminPanel';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminPanel from './pages/SuperAdminPanel';
import EventManager from './pages/EventManager';
import EditEvent from './pages/EditEvent';
import EventDetails from './pages/EventDetails';
import Calendar from './pages/Calendar';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import SuperAdminCategories from './pages/SuperAdminCategories';
import QRScanner from './pages/QRScanner';
import CheckedInUsers from './pages/CheckedInUsers';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './context/AuthContext';
import { testConnection } from './utils/api';
import { ROLES, PERMISSIONS } from './utils/rbac';
import DarkModeToggle from './components/DarkModeToggle';
import Footer from './components/Footer';
import HelpCenter from './pages/HelpCenter';
import ContactUs from './pages/ContactUs';
import FAQ from './pages/FAQ';
import Feedback from './pages/Feedback';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import AboutUs from './pages/AboutUs';

function App() {
  const [backendStatus, setBackendStatus] = useState({ connected: false, checking: true });

  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        await testConnection();
        setBackendStatus({ connected: true, checking: false });

      } catch (error) {
        setBackendStatus({ connected: false, checking: false });

      }
    };

    checkBackendConnection();
  }, []);

  return (
    <>
      <Navbar />
      <DarkModeToggle />
      {!backendStatus.connected && !backendStatus.checking && (
        <div style={{ 
          background: '#f8d7da', 
          color: '#721c24', 
          padding: '10px 20px', 
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          Backend server not connected. Please start the backend server.
        </div>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute requiredRoles={[ROLES.USER, ROLES.ADMIN, ROLES.SUPERADMIN]}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/create-event" 
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.CREATE_EVENTS}>
              <CreateEvent />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.EDIT_PROFILE}>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.SUPERADMIN]}>
              <AdminPanel />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute requiredRoles={[ROLES.ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/superadmin" 
          element={
            <ProtectedRoute requiredRoles={[ROLES.SUPERADMIN]}>
              <SuperAdminPanel />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/event-manager" 
          element={
            <ProtectedRoute requiredRoles={[ROLES.SUPERADMIN]}>
              <EventManager />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/events/:id/edit" 
          element={
            <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.SUPERADMIN]}>
              <EditEvent />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/qr-scanner" 
          element={
            <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.SUPERADMIN]}>
              <QRScanner />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/events/:eventId/checkins" 
          element={
            <ProtectedRoute requiredRoles={[ROLES.ADMIN, ROLES.SUPERADMIN]}>
              <CheckedInUsers />
            </ProtectedRoute>
          } 
        />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route 
          path="/superadmin/dashboard" 
          element={
            <ProtectedRoute requiredRoles={[ROLES.SUPERADMIN]}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/superadmin/categories" 
          element={
            <ProtectedRoute requiredRoles={[ROLES.SUPERADMIN]}>
              <SuperAdminCategories />
            </ProtectedRoute>
          } 
        />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;