import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  // If there's no current user, redirect to the login page
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If there's a current user, render the children components
  return children;
};

// Add prop types validation
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default ProtectedRoute;
