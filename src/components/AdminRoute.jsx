import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import Loader from './Loader.jsx';

function AdminRoute() {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <Loader label="Checking admin access" />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}

export default AdminRoute;
