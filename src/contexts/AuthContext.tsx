import { useState, useCallback, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getCurrentUser } from '../api/hooks/auth';
import { AuthContext, type AuthContextType, type User } from './authContextDefinition';
import i18n from '../i18n';

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

  const loadUser = useCallback(
    async (authToken: string | null) => {
      if (authToken) {
        try {
          const userData = await getCurrentUser(authToken);
          setUser(userData);
          // Update i18n language based on user locale
          if (userData.locale) {
            const lang = userData.locale.startsWith('pl') ? 'pl' : 'en';
            if (i18n.language !== lang) {
              i18n.changeLanguage(lang);
            }
          }
        } catch {
          setTokenStorage(null);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
      isInitialLoadRef.current = false;
    },
    [setTokenStorage],
  );

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

  const setToken = useCallback(
    (newToken: string | null) => {
      setTokenStorage(newToken);
    },
    [setTokenStorage],
  );

  const logout = useCallback(() => {
    removeTokenStorage();
    setUser(null);
  }, [removeTokenStorage]);

  // Sync i18n language when user locale changes
  useEffect(() => {
    if (user?.locale) {
      const lang = user.locale.startsWith('pl') ? 'pl' : 'en';
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
      }
    }
  }, [user?.locale]);

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
