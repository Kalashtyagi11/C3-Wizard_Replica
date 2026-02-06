import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.authSlice.isLoggedIn);
  const loading = useSelector((state) => state.authSlice.loading);
  const location = useLocation();

  // if (loading) {
  //   return null || []; // Don't render anything while loading
  // }

  // return isAuthenticated ? children : <Navigate to="/login" />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
