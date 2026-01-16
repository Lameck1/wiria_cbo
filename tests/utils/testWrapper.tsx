/**
 * Shared Test Utilities
 * Provides wrappers with all required providers for component/hook testing
 */

import { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

interface TestWrapperProps {
  children: ReactNode;
}

/**
 * Basic wrapper with QueryClient and BrowserRouter
 * Use for components that need routing but not auth
 */
export function TestWrapper({ children }: TestWrapperProps) {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
}

/**
 * Wrapper with MemoryRouter for more controlled routing tests
 */
export function TestWrapperWithMemoryRouter({
  children,
  initialEntries = ['/'],
}: TestWrapperProps & { initialEntries?: string[] }) {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </QueryClientProvider>
  );
}

// Removed createWrapper to avoid exporting non-component utilities from this file.
