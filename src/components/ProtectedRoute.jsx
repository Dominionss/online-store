import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import Loader from './Loader.jsx';

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader label="Checking your session" />;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}

export default ProtectedRoute;
