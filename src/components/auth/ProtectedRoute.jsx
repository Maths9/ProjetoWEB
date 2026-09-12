import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function ProtectedRoute({ requiredModule }) {
  const { isAuthenticated, hasModule } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredModule && !hasModule(requiredModule)) {
    return <Navigate to="/agendamento" replace />;
  }

  return <Outlet />;
}
