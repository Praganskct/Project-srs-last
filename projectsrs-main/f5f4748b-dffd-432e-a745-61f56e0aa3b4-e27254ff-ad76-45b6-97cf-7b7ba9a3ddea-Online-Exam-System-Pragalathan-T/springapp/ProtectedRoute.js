import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '../services/auth.service';

const ProtectedRoute = () => {
  const currentUser = AuthService.getCurrentUser();

  if (!currentUser) {
    // If no user is logged in, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If the user is logged in, render the child component
  return <Outlet />;
};

export default ProtectedRoute;