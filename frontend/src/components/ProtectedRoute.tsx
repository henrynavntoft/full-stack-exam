import { Navigate } from 'react-router-dom';
import  useAuth  from '../context/useAuth';
import Loading from './Loading';

interface ProtectedRouteProps {
  children: JSX.Element;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading />; // Show loading spinner while checking authentication
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;