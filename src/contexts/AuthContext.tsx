import { useState, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getCurrentUser } from '../api/auth';
import { AuthContext, type AuthContextType, type User } from './authContextDefinition';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setTokenStorage, removeTokenStorage] = useLocalStorage<string | null>('access_token', null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const loadUserPromiseRef = useRef<Promise<void> | null>(null);
  const currentTokenRef = useRef(token);
  const isInitialLoadRef = useRef(true);

  const loadUser = useCallback(async (authToken: string | null) => {
    if (authToken) {
      try {
        const userData = await getCurrentUser(authToken);
        setUser(userData);
      } catch {
        setTokenStorage(null);
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setIsLoading(false);
    isInitialLoadRef.current = false;
  }, [setTokenStorage]);

  if (loadUserPromiseRef.current === null) {
    loadUserPromiseRef.current = loadUser(token);
  }

  if (currentTokenRef.current !== token) {
    currentTokenRef.current = token;
    // Only show loading on initial load or when token actually changes
    if (isInitialLoadRef.current || token !== currentTokenRef.current) {
      setIsLoading(true);
    }
    loadUserPromiseRef.current = loadUser(token);
  }

  const setToken = useCallback((newToken: string | null) => {
    setTokenStorage(newToken);
  }, [setTokenStorage]);

  const logout = useCallback(() => {
    removeTokenStorage();
    setUser(null);
  }, [removeTokenStorage]);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    setUser,
    setToken,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
