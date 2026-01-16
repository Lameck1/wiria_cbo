/**
 * Test Utilities and Helpers
 * 
 * Provides reusable test utilities for consistent testing across the application
 */

import type { ReactElement } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import type { RenderOptions } from '@testing-library/react';

/**
 * Creates a fresh QueryClient for each test to avoid state leakage
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries in tests
        gcTime: 0, // Disable garbage collection
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * Custom render function that wraps components with common providers
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
  initialRoute?: string;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    queryClient = createTestQueryClient(),
    initialRoute = '/',
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  window.history.pushState({}, 'Test page', initialRoute);

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </BrowserRouter>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  };
}

/**
 * Wait for async operations to complete
 */
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock localStorage for tests
 */
export function mockLocalStorage() {
  const store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach(key => delete store[key]);
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
}

/**
 * Mock fetch for API tests
 */
export function mockFetch(response: unknown, status = 200) {
  return vi.fn(() =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response)),
    } as Response)
  );
}

/**
 * Create mock user for auth tests
 */
export function createMockUser(overrides = {}) {
  return {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
    ...overrides,
  };
}

/**
 * Create mock admin user for admin tests
 */
export function createMockAdminUser(overrides = {}) {
  return createMockUser({
    role: 'admin',
    email: 'admin@example.com',
    name: 'Admin User',
    ...overrides,
  });
}

/**
 * Suppress console errors in tests (useful for testing error boundaries)
 */
export function suppressConsoleError() {
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });
}

const DEFAULT_WAIT_OPTIONS = { timeout: 3000 };

/**
 * Wait for element to be removed from DOM
 */
export async function waitForElementToBeRemoved(
  callback: () => HTMLElement | null,
  options = DEFAULT_WAIT_OPTIONS
) {
  const start = Date.now();
  while (callback() && Date.now() - start < options.timeout) {
    await waitFor(50);
  }
  if (callback()) {
    throw new Error('Element was not removed within timeout');
  }
}
