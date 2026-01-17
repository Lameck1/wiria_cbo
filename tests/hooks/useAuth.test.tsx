/**
 * useAuth Hook and AuthContext Tests
 * Critical authentication tests for secure user login/logout
 */

import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from '@/features/auth/context/AuthContext';
import { useAuth } from '@/features/auth/context/useAuth';
import { apiClient } from '@/shared/services/api/client';
import { storageService, STORAGE_KEYS } from '@/shared/services/storage/storageService';
import { UserRole } from '@/shared/types';

// Mock dependencies
vi.mock('@/shared/services/api/client');
vi.mock('@/shared/services/storage/storageService');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Test wrapper with AuthProvider
const wrapper = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>{children}</AuthProvider>
  </BrowserRouter>
);

describe('useAuth and AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(storageService.get).mockReturnValue(null);
    vi.mocked(storageService.set).mockReturnValue(undefined);
    vi.mocked(storageService.clear).mockReturnValue(undefined);
  });

  describe('useAuth hook', () => {
    it('should throw error when used outside AuthProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleSpy.mockRestore();
    });

    it('should return auth context when used within AuthProvider', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current).toHaveProperty('user');
      expect(result.current).toHaveProperty('login');
      expect(result.current).toHaveProperty('logout');
      expect(result.current).toHaveProperty('isAuthenticated');
      expect(result.current).toHaveProperty('isLoading');
    });
  });

  describe('authentication state', () => {
    it('should initialize with null user and loading state', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should load existing auth data from storage on mount', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.STAFF,
      };

      const mockToken = 'valid-token-123';

      vi.mocked(storageService.get).mockImplementation((key) => {
        if (key === STORAGE_KEYS.AUTH_TOKEN) return mockToken;
        if (key === STORAGE_KEYS.USER_DATA) return mockUser;
        return null;
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(apiClient.setTokenResolver).toHaveBeenCalled();
    });

    it('should handle missing auth data gracefully', async () => {
      vi.mocked(storageService.get).mockReturnValue(null);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('login', () => {
    it('should successfully login staff user', async () => {
      const mockCredentials = {
        identifier: 'staff@example.com',
        password: 'Password123!',
      };

      const mockUser = {
        id: 'staff-123',
        email: 'staff@example.com',
        firstName: 'Staff',
        lastName: 'User',
        role: UserRole.STAFF,
      };

      const mockTokens = {
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-456',
      };

      const mockResponse = {
        data: {
          user: mockUser,
          tokens: mockTokens,
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const loggedInUser = await result.current.login(mockCredentials, false);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', mockCredentials);
      expect(storageService.set).toHaveBeenCalledWith(STORAGE_KEYS.AUTH_TOKEN, mockTokens.accessToken);
      expect(storageService.set).toHaveBeenCalledWith(STORAGE_KEYS.REFRESH_TOKEN, mockTokens.refreshToken);
      expect(storageService.set).toHaveBeenCalledWith(STORAGE_KEYS.USER_ROLE, mockUser.role);
      expect(storageService.set).toHaveBeenCalledWith(STORAGE_KEYS.USER_DATA, mockUser);
      expect(apiClient.setAuthToken).toHaveBeenCalledWith(mockTokens.accessToken);
      expect(loggedInUser).toEqual(mockUser);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should successfully login member user', async () => {
      const mockCredentials = {
        identifier: 'member@example.com',
        password: 'Password123!',
      };

      const mockUser = {
        id: 'member-123',
        email: 'member@example.com',
        firstName: 'Member',
        lastName: 'User',
        role: UserRole.MEMBER,
      };

      const mockTokens = {
        accessToken: 'access-token-789',
        refreshToken: 'refresh-token-012',
      };

      const mockResponse = {
        data: {
          user: mockUser,
          tokens: mockTokens,
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await result.current.login(mockCredentials, true);

      expect(apiClient.post).toHaveBeenCalledWith('/members/login', mockCredentials);
      expect(result.current.user).toEqual(mockUser);
    });

    it('should handle login failure', async () => {
      const mockCredentials = {
        identifier: 'invalid@example.com',
        password: 'WrongPassword',
      };

      const mockError = {
        response: {
          data: {
            message: 'Invalid credentials',
          },
        },
      };

      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(result.current.login(mockCredentials, false)).rejects.toEqual(mockError);
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('logout', () => {
    it('should successfully logout staff user', async () => {
      // Setup: logged in user
      const mockUser = {
        id: 'staff-123',
        email: 'staff@example.com',
        role: UserRole.STAFF,
      };

      vi.mocked(storageService.get).mockImplementation((key) => {
        if (key === STORAGE_KEYS.USER_ROLE) return UserRole.STAFF;
        if (key === STORAGE_KEYS.REFRESH_TOKEN) return 'refresh-token-123';
        return null;
      });

      vi.mocked(apiClient.post).mockResolvedValue({ data: {} });

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Manually set user to simulate logged in state
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await result.current.logout();

      expect(apiClient.post).toHaveBeenCalledWith('/auth/logout', { refreshToken: 'refresh-token-123' });
      expect(storageService.clear).toHaveBeenCalled();
      expect(apiClient.setTokenResolver).toHaveBeenCalledWith(expect.any(Function));
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should successfully logout member user', async () => {
      vi.mocked(storageService.get).mockImplementation((key) => {
        if (key === STORAGE_KEYS.USER_ROLE) return UserRole.MEMBER;
        return null;
      });

      vi.mocked(apiClient.post).mockResolvedValue({ data: {} });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await result.current.logout();

      expect(apiClient.post).toHaveBeenCalledWith('/members/logout', {});
      expect(storageService.clear).toHaveBeenCalled();
    });

    it('should handle logout API failure gracefully', async () => {
      vi.mocked(storageService.get).mockImplementation((key) => {
        if (key === STORAGE_KEYS.USER_ROLE) return UserRole.STAFF;
        if (key === STORAGE_KEYS.REFRESH_TOKEN) return 'refresh-token-123';
        return null;
      });

      vi.mocked(apiClient.post).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should not throw - logout should complete locally even if API fails
      await expect(result.current.logout()).resolves.toBeUndefined();
      
      expect(storageService.clear).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
    });

    it('should handle expired session logout', async () => {
      vi.mocked(storageService.get).mockImplementation((key) => {
        if (key === STORAGE_KEYS.USER_ROLE) return UserRole.STAFF;
        return null;
      });

      vi.mocked(apiClient.post).mockResolvedValue({ data: {} });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await result.current.logout(true);

      expect(storageService.clear).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
    });
  });

  describe('401 unauthorized handling', () => {
    it('should register unauthorized callback on mount', async () => {
      renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(apiClient.setUnauthorizedCallback).toHaveBeenCalled();
      });
    });

    it('should cleanup unauthorized callback on unmount', async () => {
      const { unmount } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(apiClient.setUnauthorizedCallback).toHaveBeenCalledTimes(1);
      });

      unmount();

      // Second call for cleanup
      await waitFor(() => {
        expect(apiClient.setUnauthorizedCallback).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('isAuthenticated computed property', () => {
    it('should return false when user is null', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should return true when user exists', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        role: UserRole.STAFF,
      };

      vi.mocked(storageService.get).mockImplementation((key) => {
        if (key === STORAGE_KEYS.AUTH_TOKEN) return 'token-123';
        if (key === STORAGE_KEYS.USER_DATA) return mockUser;
        return null;
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });
  });
});
