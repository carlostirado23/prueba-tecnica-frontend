import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;

  return user ? children : <Navigate to="/login" replace />;
}

export function PublicRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;

  return user ? <Navigate to="/dashboard" replace /> : children;
}

export function AdminRoute({ children }) {
  const { adminToken, loading } = useContext(AuthContext);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;

  return adminToken ? children : <Navigate to="/" />;
}
