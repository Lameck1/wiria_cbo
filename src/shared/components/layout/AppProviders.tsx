import { Suspense } from 'react';

import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { AuthProvider } from '@/features/auth/context/AuthContext';
import { BackendStatusProvider } from '@/shared/services/backendStatus';
import { ServiceProvider } from '@/shared/services/di';
import { defaultServiceContainer } from '@/shared/services/serviceContainer';

import { ScrollToTop } from './ScrollToTop';

/**
 * AppProviders Component
 * Centralized provider composition following best practices.
 * 
 * Provider hierarchy (outer to inner):
 * 1. ServiceProvider - Dependency injection container
 * 2. BackendStatusProvider - Backend connectivity monitoring
 * 3. AuthProvider - Authentication state management
 * 
 * Benefits:
 * - Single source of truth for provider composition
 * - Clear provider hierarchy and dependencies
 * - Prevents "provider hell" with nested providers
 * - Easy to maintain and extend
 */
export function AppProviders() {
  return (
    <ServiceProvider services={defaultServiceContainer()}>
      <BackendStatusProvider>
        <AuthProvider>
          <ScrollToTop />
          <Suspense fallback={<PageLoadingSkeleton />}>
            <Outlet />
          </Suspense>
          <ToastContainer />
        </AuthProvider>
      </BackendStatusProvider>
    </ServiceProvider>
  );
}

function PageLoadingSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-wiria-blue-dark" />
    </div>
  );
}
