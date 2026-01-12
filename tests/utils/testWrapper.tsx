/**
 * Shared Test Utilities
 * Provides wrappers with all required providers for component/hook testing
 */

import { ReactNode } from 'react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Creates a fresh QueryClient for each test to prevent state leakage
 */
export function createTestQueryClient() {
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

/**
 * Creates a wrapper function for renderHook
 */
export function createWrapper() {
  const queryClient = createTestQueryClient();
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>{children}</BrowserRouter>
      </QueryClientProvider>
    );
  };
}
