import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { AuthProvider } from '@/features/auth/context/AuthContext';
import HomePage from '@/pages/HomePage';

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

describe('HomePage', () => {
  it('renders homepage correctly', () => {
    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AuthProvider>
            <HomePage />
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getAllByText(/wiria cbo/i).length).toBeGreaterThan(0);
    // Check for focus areas section heading which is always visible
    expect(screen.getByText(/our focus areas/i)).toBeInTheDocument();
  });
});
