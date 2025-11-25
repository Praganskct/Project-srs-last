import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '../services/auth.service';

const AdminRoute = () => {
  const currentUser = AuthService.getCurrentUser();

  if (!currentUser) {
    // Not logged in, redirect to login
    return <Navigate to="/login" />;
  }

  const isAdmin = currentUser.roles && currentUser.roles.includes('ROLE_ADMIN');

  if (!isAdmin) {
    // Logged in but not an admin, redirect to the user dashboard
    return <Navigate to="/" />;
  }

  // If the user is an admin, render the child component
  return <Outlet />;
};

export default AdminRoute;