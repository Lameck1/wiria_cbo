/**
 * Service Container Factory
 * 
 * Creates and configures the service container with all application services.
 * This is the single source of truth for service instances.
 */

import {
  apiClientAdapter,
  loggerAdapter,
  notificationServiceAdapter,
  storageServiceAdapter,
} from '@/shared/services/adapters';
import type { IServiceContainer } from '@/shared/types/services';

/**
 * Creates the default service container with production implementations
 * 
 * @returns Service container with all configured services
 */
export const createServiceContainer = (): IServiceContainer => {
  return {
    apiClient: apiClientAdapter,
    notificationService: notificationServiceAdapter,
    logger: loggerAdapter,
    storageService: storageServiceAdapter,
  };
};

/**
 * Creates a service container with mock implementations for testing
 * 
 * @example
 * const mockServices = createMockServiceContainer({
 *   apiClient: {
 *     post: jest.fn().mockResolvedValue({ success: true })
 *   }
 * });
 * 
 * render(
 *   <ServiceProvider services={mockServices}>
 *     <MyComponent />
 *   </ServiceProvider>
 * );
 */
export const createMockServiceContainer = (
  overrides: Partial<IServiceContainer> = {}
): IServiceContainer => {
  const defaultMocks: IServiceContainer = {
    apiClient: {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
      setTokenResolver: jest.fn(),
      setUnauthorizedCallback: jest.fn(),
    },
    notificationService: {
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
      info: jest.fn(),
      clearAll: jest.fn(),
    },
    logger: {
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    },
    storageService: {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    },
  };

  return {
    ...defaultMocks,
    ...overrides,
  };
};
