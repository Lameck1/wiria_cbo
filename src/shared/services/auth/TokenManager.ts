/**
 * TokenManager - Centralized token management service
 * 
 * Handles all token-related operations including storage, retrieval, and validation.
 * Provides a clean interface for authentication token management.
 * 
 * @see Phase 2 - Task 1: Extract TokenManager from AuthContext
 */

import { STORAGE_KEYS, storageService } from '../storage/storageService';
import { logger } from '../logger';
import type { UserRole } from '@/shared/types';

export interface TokenData {
  accessToken: string;
  refreshToken: string;
  role: UserRole;
}

export class TokenManager {
  /**
   * Store authentication tokens and related data
   */
  static setTokens(tokens: TokenData): void {
    try {
      storageService.set(STORAGE_KEYS.AUTH_TOKEN, tokens.accessToken);
      storageService.set(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
      storageService.set(STORAGE_KEYS.USER_ROLE, tokens.role);
      logger.debug('Tokens stored successfully');
    } catch (error) {
      logger.error('Failed to store tokens:', error);
      throw error;
    }
  }

  /**
   * Get the current access token
   */
  static getAccessToken(): string | null {
    return storageService.get<string>(STORAGE_KEYS.AUTH_TOKEN);
  }

  /**
   * Get the current refresh token
   */
  static getRefreshToken(): string | null {
    return storageService.get<string>(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * Get the current user role
   */
  static getUserRole(): UserRole | null {
    return storageService.get<UserRole>(STORAGE_KEYS.USER_ROLE);
  }

  /**
   * Check if user has valid tokens
   */
  static hasValidTokens(): boolean {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    return !!(accessToken && refreshToken);
  }

  /**
   * Clear all tokens from storage
   */
  static clearTokens(): void {
    try {
      storageService.remove(STORAGE_KEYS.AUTH_TOKEN);
      storageService.remove(STORAGE_KEYS.REFRESH_TOKEN);
      storageService.remove(STORAGE_KEYS.USER_ROLE);
      logger.debug('Tokens cleared successfully');
    } catch (error) {
      logger.error('Failed to clear tokens:', error);
      throw error;
    }
  }

  /**
   * Clear all authentication data including user data
   */
  static clearAll(): void {
    try {
      storageService.clear();
      logger.debug('All authentication data cleared');
    } catch (error) {
      logger.error('Failed to clear authentication data:', error);
      throw error;
    }
  }

  /**
   * Token resolver function for ApiClient integration
   */
  static tokenResolver = (): string | null => {
    return TokenManager.getAccessToken();
  };
}
