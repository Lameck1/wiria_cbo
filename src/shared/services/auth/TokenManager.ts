/**
 * TokenManager - Centralized token management service
 * 
 * Handles all token-related operations including storage, retrieval, and validation.
 * Provides a clean interface for authentication token management.
 * 
 * @see Phase 2 - Task 1: Extract TokenManager from AuthContext
 */

import type { UserRole } from '@/shared/types';

import { logger } from '../logger';
import { STORAGE_KEYS, storageService } from '../storage/storageService';

interface TokenData {
  accessToken: string;
  refreshToken: string;
  role: UserRole;
}

export const TokenManager = {
  /**
   * Store authentication tokens and related data
   */
  setTokens(tokens: TokenData): void {
    try {
      storageService.set(STORAGE_KEYS.AUTH_TOKEN, tokens.accessToken);
      storageService.set(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
      storageService.set(STORAGE_KEYS.USER_ROLE, tokens.role);
      logger.debug('Tokens stored successfully');
    } catch (error) {
      logger.error('Failed to store tokens:', error);
      throw error;
    }
  },

  /**
   * Get the current access token
   */
  getAccessToken(): string | null {
    return storageService.get<string>(STORAGE_KEYS.AUTH_TOKEN);
  },

  /**
   * Get the current refresh token
   */
  getRefreshToken(): string | null {
    return storageService.get<string>(STORAGE_KEYS.REFRESH_TOKEN);
  },

  /**
   * Get the current user role
   */
  getUserRole(): UserRole | null {
    return storageService.get<UserRole>(STORAGE_KEYS.USER_ROLE);
  },

  /**
   * Check if user has valid tokens
   */
  hasValidTokens(): boolean {
    const accessToken = storageService.get<string>(STORAGE_KEYS.AUTH_TOKEN);
    const refreshToken = storageService.get<string>(STORAGE_KEYS.REFRESH_TOKEN);
    return !!(accessToken && refreshToken);
  },

  /**
   * Clear all tokens from storage
   */
  clearTokens(): void {
    try {
      storageService.remove(STORAGE_KEYS.AUTH_TOKEN);
      storageService.remove(STORAGE_KEYS.REFRESH_TOKEN);
      storageService.remove(STORAGE_KEYS.USER_ROLE);
      logger.debug('Tokens cleared successfully');
    } catch (error) {
      logger.error('Failed to clear tokens:', error);
      throw error;
    }
  },

  /**
   * Clear all authentication data including user data
   */
  clearAll(): void {
    try {
      storageService.clear();
      logger.debug('All authentication data cleared');
    } catch (error) {
      logger.error('Failed to clear authentication data:', error);
      throw error;
    }
  },

  /**
   * Token resolver function for ApiClient integration
   */
  tokenResolver(): string | null {
    return storageService.get<string>(STORAGE_KEYS.AUTH_TOKEN);
  },
};
