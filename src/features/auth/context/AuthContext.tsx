/**
 * Auth Context
 * Manages authentication state and user session
 */

import {
  createContext,
  use,
  ReactNode,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Member, UserRole, AuthResponse } from '@/shared/types';
import { storageService, STORAGE_KEYS } from '@/shared/services/storage/storageService';
import { apiClient } from '@/shared/services/api/client';
import { ROUTES } from '@/shared/constants/routes';

interface AuthContextType {
  user: User | Member | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    credentials: { identifier: string; password: string },
    isMember?: boolean
  ) => Promise<User | Member>;
  logout: (expired?: boolean) => Promise<void>;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuth = useCallback(() => {
    const token = storageService.get<string>(STORAGE_KEYS.AUTH_TOKEN);
    const userData = storageService.get<User | Member>(STORAGE_KEYS.USER_DATA);

    if (token && userData) {
      // Register token resolver with ApiClient
      apiClient.setTokenResolver(() => storageService.get<string>(STORAGE_KEYS.AUTH_TOKEN));
      setUser(userData);
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  const logout = useCallback(
    async (expired = false) => {
      const role = storageService.get<UserRole>(STORAGE_KEYS.USER_ROLE);

      try {
        if (role === UserRole.MEMBER) {
          await apiClient.post('/members/logout', {});
        } else {
          const refreshToken = storageService.get<string>(STORAGE_KEYS.REFRESH_TOKEN);
          if (refreshToken) {
            await apiClient.post('/auth/logout', { refreshToken });
          }
        }
      } catch (error) {
        console.error('Logout API call failed:', error);
      } finally {
        // Clear local state
        apiClient.setTokenResolver(() => null);
        storageService.clear();
        setUser(null);

        // Redirect if session expired or logout triggered
        if (expired) {
          const loginRoute = role === UserRole.MEMBER ? ROUTES.MEMBER_LOGIN : ROUTES.STAFF_LOGIN;
          navigate(`${loginRoute}?expired=true`);
        } else {
          navigate('/');
        }
      }
    },
    [navigate]
  );

  useEffect(() => {
    checkAuth();

    // Register global 401 handler
    apiClient.setUnauthorizedCallback(() => {
      console.warn('Session expired - logging out');
      logout(true);
    });

    // Clean up callback on unmount
    return () => apiClient.setUnauthorizedCallback(() => { });
  }, [checkAuth, logout]);

  const login = useCallback(
    async (credentials: { identifier: string; password: string }, isMember = false) => {
      const endpoint = isMember ? '/members/login' : '/auth/login';
      const response = await apiClient.post<AuthResponse>(endpoint, credentials);

      const { user: userData, tokens } = response.data;

      // Store auth data
      apiClient.setAuthToken(tokens.accessToken);
      storageService.set(STORAGE_KEYS.AUTH_TOKEN, tokens.accessToken);
      storageService.set(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
      storageService.set(STORAGE_KEYS.USER_ROLE, userData.role);
      storageService.set(STORAGE_KEYS.USER_DATA, userData);

      setUser(userData);
      return userData;
    },
    []
  );

  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      checkAuth,
    }),
    [user, isLoading, login, logout, checkAuth]
  );

  return <AuthContext value={contextValue}>{children}</AuthContext>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = use(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
