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
 */
export const createMockServiceContainer = (
  overrides: Partial<IServiceContainer> = {}
): IServiceContainer => {
  const defaultMocks: IServiceContainer = {
    apiClient: {
      get() {
        return new Promise<never>((resolve) => {
          resolve(null as never);
        });
      },
      post() {
        return new Promise<never>((resolve) => {
          resolve(null as never);
        });
      },
      put() {
        return new Promise<never>((resolve) => {
          resolve(null as never);
        });
      },
      patch() {
        return new Promise<never>((resolve) => {
          resolve(null as never);
        });
      },
      delete() {
        return new Promise<never>((resolve) => {
          resolve(null as never);
        });
      },
      setTokenResolver() {
        return;
      },
      setUnauthorizedCallback() {
        return;
      },
    },
    notificationService: {
      success() {
        return;
      },
      error() {
        return;
      },
      warning() {
        return;
      },
      info() {
        return;
      },
      clearAll() {
        return;
      },
    },
    logger: {
      error() {
        return;
      },
      warn() {
        return;
      },
      debug() {
        return;
      },
    },
    storageService: {
      getItem() {
        return null;
      },
      setItem() {
        return;
      },
      removeItem() {
        return;
      },
      clear() {
        return;
      },
    },
  };

  return {
    ...defaultMocks,
    ...overrides,
  };
};
