/**
 * Service Adapters
 * 
 * Adapts existing service implementations to implement the service interfaces.
 * This allows existing services to work with the dependency injection system.
 */

import { apiClient } from '@/shared/services/api/client';
import { logger } from '@/shared/services/logger';
import { useNotificationStore } from '@/shared/services/notification/notificationService';
import { storage } from '@/shared/services/storage/storageService';
import type {
  IApiClient,
  ILogger,
  INotificationService,
  IStorageService,
} from '@/shared/types/services';

// ============================================================================
// API Client Adapter
// ============================================================================

/**
 * Adapts the existing ApiClient to implement IApiClient interface
 */
export const apiClientAdapter: IApiClient = {
  get: <T,>(url: string) => apiClient.get<T>(url),
  post: <T, D = unknown>(url: string, data?: D) => apiClient.post<T, D>(url, data),
  put: <T, D = unknown>(url: string, data?: D) => apiClient.put<T, D>(url, data),
  patch: <T, D = unknown>(url: string, data?: D) => apiClient.patch<T, D>(url, data),
  delete: <T,>(url: string) => apiClient.delete<T>(url),
  setTokenResolver: (resolver: () => string | null) => apiClient.setTokenResolver(resolver),
  setUnauthorizedCallback: (callback: () => void) => apiClient.setUnauthorizedCallback(callback),
};

// ============================================================================
// Notification Service Adapter
// ============================================================================

/**
 * Adapts the Zustand notification store to implement INotificationService interface
 */
export const notificationServiceAdapter: INotificationService = {
  success: (message: string, duration?: number) => {
    useNotificationStore.getState().addNotification({
      type: 'success',
      message,
      duration,
    });
  },
  error: (message: string, duration?: number) => {
    useNotificationStore.getState().addNotification({
      type: 'error',
      message,
      duration,
    });
  },
  warning: (message: string, duration?: number) => {
    useNotificationStore.getState().addNotification({
      type: 'warning',
      message,
      duration,
    });
  },
  info: (message: string, duration?: number) => {
    useNotificationStore.getState().addNotification({
      type: 'info',
      message,
      duration,
    });
  },
  clearAll: () => {
    useNotificationStore.getState().clearAll();
  },
};

// ============================================================================
// Logger Adapter
// ============================================================================

/**
 * Adapts the existing logger to implement ILogger interface
 */
export const loggerAdapter: ILogger = {
  error: (message: string, ...args: unknown[]) => logger.error(message, ...args),
  warn: (message: string, ...args: unknown[]) => logger.warn(message, ...args),
  debug: (message: string, ...args: unknown[]) => logger.debug(message, ...args),
};

// ============================================================================
// Storage Service Adapter
// ============================================================================

/**
 * Adapts the existing storage service to implement IStorageService interface
 */
export const storageServiceAdapter: IStorageService = {
  getItem: <T,>(key: string) => storage.getItem<T>(key),
  setItem: <T,>(key: string, value: T) => storage.setItem<T>(key, value),
  removeItem: (key: string) => storage.removeItem(key),
  clear: () => storage.clear(),
};
