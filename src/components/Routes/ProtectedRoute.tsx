import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts';
import { Loader } from '../Loader';
import { MainLayout } from '../Layout';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return <Loader fullScreen message="Loading your account..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return <MainLayout />;
}
