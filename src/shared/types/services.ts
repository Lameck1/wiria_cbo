/**
 * Service Interfaces
 * 
 * Defines contracts for all application services to enable:
 * - Dependency Injection
 * - Easy testing with mocks
 * - Loose coupling between components and implementations
 * - SOLID principles (Dependency Inversion Principle)
 */

// ============================================================================
// API Client Interface
// ============================================================================

export interface IApiClient {
  /**
   * Performs a GET request
   */
  get<T>(url: string): Promise<T>;

  /**
   * Performs a POST request
   */
  post<T, D = unknown>(url: string, data?: D): Promise<T>;

  /**
   * Performs a PUT request
   */
  put<T, D = unknown>(url: string, data?: D): Promise<T>;

  /**
   * Performs a PATCH request
   */
  patch<T, D = unknown>(url: string, data?: D): Promise<T>;

  /**
   * Performs a DELETE request
   */
  delete<T>(url: string): Promise<T>;

  /**
   * Sets a function to resolve the current authentication token
   */
  setTokenResolver(resolver: () => string | null): void;

  /**
   * Sets a callback to be invoked on 401 Unauthorized responses
   */
  setUnauthorizedCallback(callback: () => void): void;
}

// ============================================================================
// Notification Service Interface
// ============================================================================

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface INotificationService {
  /**
   * Shows a success notification
   */
  success(message: string, duration?: number): void;

  /**
   * Shows an error notification
   */
  error(message: string, duration?: number): void;

  /**
   * Shows a warning notification
   */
  warning(message: string, duration?: number): void;

  /**
   * Shows an info notification
   */
  info(message: string, duration?: number): void;

  /**
   * Clears all notifications
   */
  clearAll(): void;
}

// ============================================================================
// Logger Service Interface
// ============================================================================

export interface ILogger {
  /**
   * Logs an error message
   */
  error(message: string, ...args: unknown[]): void;

  /**
   * Logs a warning message
   */
  warn(message: string, ...args: unknown[]): void;

  /**
   * Logs a debug message
   */
  debug(message: string, ...args: unknown[]): void;
}

// ============================================================================
// Storage Service Interface
// ============================================================================

export interface IStorageService {
  /**
   * Gets an item from storage
   */
  getItem<T>(key: string): T | null;

  /**
   * Sets an item in storage
   */
  setItem<T>(key: string, value: T): void;

  /**
   * Removes an item from storage
   */
  removeItem(key: string): void;

  /**
   * Clears all items from storage
   */
  clear(): void;
}

// ============================================================================
// Service Container Interface
// ============================================================================

/**
 * Container for all application services
 * Used for dependency injection throughout the app
 */
export interface IServiceContainer {
  apiClient: IApiClient;
  notificationService: INotificationService;
  logger: ILogger;
  storageService: IStorageService;
}
