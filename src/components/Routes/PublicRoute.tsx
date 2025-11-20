import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts';
import { Loader } from '../Loader';
import type { ReactNode } from 'react';

interface PublicRouteProps {
  children: ReactNode;
}

/**
 * Komponent dla publicznych route'ów (np. login)
 * Jeśli użytkownik jest zalogowany, przekierowuje do dashboard
 */
export function PublicRoute({ children }: PublicRouteProps) {
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
        <Loader message="Checking authentication..." />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
