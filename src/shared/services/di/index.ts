/**
 * Service Dependency Injection System
 * 
 * Exports all components needed for the DI system:
 * - Service interfaces (types)
 * - Service context and provider
 * - Service container factory
 * - Hook to access services
 */

// Types
// export type {
//   IApiClient,
//   ILogger,
//   INotificationService,
//   IServiceContainer,
//   IStorageService,
// } from '@/shared/types/services';

// Context and Provider
export { ServiceProvider, useServices } from '@/shared/contexts/ServiceContext';

// Service Container
export { createMockServiceContainer } from '@/shared/services/serviceContainer';
