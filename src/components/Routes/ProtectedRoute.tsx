import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts';
import { Loader } from '../Loader';
import { MainLayout } from '../Layout';

interface ProtectedRouteProps {
  navbarVisible?: boolean;
}

export function ProtectedRoute({ navbarVisible = true }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Loader message="Loading your account..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return <MainLayout navbarVisible={navbarVisible} />;
}
