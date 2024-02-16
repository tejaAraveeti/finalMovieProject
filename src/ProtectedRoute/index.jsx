// ProtectedRoute.js
import React, { useEffect } from 'react';
import { Route, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return <Route {...rest} element={isAuthenticated ? <Element /> : null} />;
};

export default ProtectedRoute;
