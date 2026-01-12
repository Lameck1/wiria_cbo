import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/features/auth/context/AuthContext';

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

    expect(screen.getAllByText(/WIRIA CBO/i).length).toBeGreaterThan(0);
    // Check for focus areas section heading which is always visible
    expect(screen.getByText(/Our Focus Areas/i)).toBeInTheDocument();
  });
});
