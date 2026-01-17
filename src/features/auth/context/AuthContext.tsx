import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/shared/constants/routes';
import { apiClient } from '@/shared/services/api/client';
import { TokenManager } from '@/shared/services/auth';
import { logger } from '@/shared/services/logger';
import { STORAGE_KEYS, storageService } from '@/shared/services/storage/storageService';
import type { AuthResponse, Member, User } from '@/shared/types';
import { UserRole } from '@/shared/types';

import { AuthContext } from './AuthContextBase';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuth = useCallback(() => {
    const userData = storageService.get<User | Member>(STORAGE_KEYS.USER_DATA);

    if (TokenManager.hasValidTokens() && userData) {
      // Register token resolver with ApiClient
      apiClient.setTokenResolver(TokenManager.tokenResolver);
      setUser(userData);
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  const logout = useCallback(
    async (expired = false) => {
      const role = TokenManager.getUserRole();

      try {
        if (role === UserRole.MEMBER) {
          await apiClient.post('/members/logout', {});
        } else {
          const refreshToken = TokenManager.getRefreshToken();
          if (refreshToken) {
            await apiClient.post('/auth/logout', { refreshToken });
          }
        }
      } catch (error) {
        logger.error('Logout API call failed:', error);
      } finally {
        // Clear local state
        apiClient.setTokenResolver(() => null);
        TokenManager.clearAll();
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
      logger.warn('Session expired - logging out');
      void logout(true);
    });

    // Clean up callback on unmount
    return () =>
      apiClient.setUnauthorizedCallback(() => {
        // Cleanup - no action needed
      });
  }, [checkAuth, logout]);

  const login = useCallback(
    async (credentials: { identifier: string; password: string }, isMember = false) => {
      const endpoint = isMember ? '/members/login' : '/auth/login';
      const response = await apiClient.post<AuthResponse>(endpoint, credentials);

      const { user: userData, tokens } = response.data;

      // Store auth data using TokenManager
      apiClient.setAuthToken(tokens.accessToken);
      TokenManager.setTokens({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        role: userData.role,
      });
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
