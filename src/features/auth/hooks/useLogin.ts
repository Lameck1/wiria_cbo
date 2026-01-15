/**
 * useLogin Hook
 * Handles login flow with loading and error states
 */

import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/shared/constants/routes';
import { ApiError } from '@/shared/services/api/client';
import { notificationService } from '@/shared/services/notification/notificationService';
import { UserRole } from '@/shared/types';

import { useAuth } from '../context/AuthContext';

export function useLogin(isMember = false) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (credentials: { identifier: string; password: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      const loggedInUser = await login(credentials, isMember);

      notificationService.success('Login successful!');

      // Redirect based on role - Use fresh user data!
      const role = loggedInUser.role;

      if (role === UserRole.MEMBER) {
        navigate(ROUTES.MEMBER_PORTAL, { replace: true });
      } else if (
        [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF].includes(role as UserRole)
      ) {
        navigate(ROUTES.ADMIN, { replace: true });
      } else {
        navigate(ROUTES.HOME, { replace: true });
      }
    } catch (error_) {
      const message =
        error_ instanceof ApiError
          ? error_.message || 'Invalid credentials'
          : 'Login failed. Please try again.';
      setError(message);
      notificationService.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleLogin,
    isLoading,
    error,
  };
}
