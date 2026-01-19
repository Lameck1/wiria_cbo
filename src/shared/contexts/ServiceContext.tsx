/**
 * Service Context
 * 
 * Provides dependency injection for all application services.
 * Components can access services through useServices() hook.
 * 
 * Benefits:
 * - Easy to test (can inject mock services)
 * - Loose coupling (components depend on interfaces, not implementations)
 * - Single source of truth for service instances
 * - Follows Dependency Inversion Principle (SOLID)
 */

import { createContext, type ReactNode, useContext } from 'react';

import type { IServiceContainer } from '@/shared/types/services';

// Create context with undefined default (will throw if used outside provider)
const ServiceContext = createContext<IServiceContainer | undefined>(undefined);

interface ServiceProviderProps {
  services: IServiceContainer;
  children: ReactNode;
}

/**
 * ServiceProvider component
 * Wraps the application and provides services to all components
 */
export const ServiceProvider = ({ services, children }: ServiceProviderProps) => {
  return <ServiceContext.Provider value={services}>{children}</ServiceContext.Provider>;
};

/**
 * useServices hook
 * Access application services from any component
 * 
 * @throws Error if used outside ServiceProvider
 * 
 * @example
 * const MyComponent = () => {
 *   const { apiClient, notificationService, logger } = useServices();
 * 
 *   const handleSubmit = async (data) => {
 *     logger.info('Submitting form');
 *     try {
 *       const response = await apiClient.post('/submit', data);
 *       notificationService.success('Submitted successfully!');
 *     } catch (error) {
 *       logger.error('Submission failed', error);
 *       notificationService.error('Submission failed');
 *     }
 *   };
 * 
 *   return <button onClick={handleSubmit}>Submit</button>;
 * };
 */
export const useServices = (): IServiceContainer => {
  const services = useContext(ServiceContext);
  
  if (!services) {
    throw new Error('useServices must be used within ServiceProvider');
  }
  
  return services;
};
