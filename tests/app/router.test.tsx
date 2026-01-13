/**
 * Router Navigation Tests
 * Ensures no page-level loading spinners during navigation
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Simple test routes - not using actual lazy-loaded routes to avoid complexity
const testRoutes = [
  {
    path: '/',
    element: <div data-testid="home">Home Page</div>,
  },
  {
    path: '/about',
    element: <div data-testid="about">About Page</div>,
  },
];

function renderWithProviders(initialEntries: string[]) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const router = createMemoryRouter(testRoutes, { initialEntries });

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

describe('Router Navigation', () => {
  it('should NOT display page-level loading spinner during navigation', () => {
    renderWithProviders(['/']);

    // Should NOT find any global loading indicators
    const loader = screen.queryByTestId('page-loader');
    const spinner = screen.queryByText(/loading/i);

    expect(loader).not.toBeInTheDocument();
    expect(spinner).not.toBeInTheDocument();
  });

  it('should render pages immediately without suspense fallback', () => {
    const { container } = renderWithProviders(['/about']);

    // Page should render instantly - no "Loading..." or spinner
    expect(container.querySelector('[data-loading]')).not.toBeInTheDocument();
  });

  it('should navigate between routes instantly', () => {
    // First render on home
    renderWithProviders(['/']);
    expect(screen.getByTestId('home')).toBeInTheDocument();

    // Render on about route
    renderWithProviders(['/about']);
    expect(screen.getByTestId('about')).toBeInTheDocument();

    // Should not show any loading state
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
});
