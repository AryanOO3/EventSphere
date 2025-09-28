import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { hasRole, hasPermission } from '../utils/rbac';

const ProtectedRoute = ({ children, requiredRoles, requiredPermission }) => {
  const { currentUser, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRoles && !hasRole(currentUser.role, requiredRoles)) {
    return <Navigate to="/unauthorized" />;
  }
  
  if (requiredPermission && !hasPermission(currentUser.role, requiredPermission)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};

export default ProtectedRoute;