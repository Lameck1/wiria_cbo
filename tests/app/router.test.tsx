/**
 * Router Navigation Tests
 * Ensures no page-level loading spinners during navigation
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRouter from '@/app/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/features/auth/context/AuthContext';

function renderWithProviders(initialEntries: string[]) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });

    return render(
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <MemoryRouter initialEntries={initialEntries}>
                    <AppRouter />
                </MemoryRouter>
            </AuthProvider>
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
        const { rerender } = renderWithProviders(['/']);

        // Navigate to different route
        rerender(
            <QueryClientProvider
                client={new QueryClient({
                    defaultOptions: {
                        queries: { retry: false },
                    },
                })}
            >
                <AuthProvider>
                    <MemoryRouter initialEntries={['/about']}>
                        <AppRouter />
                    </MemoryRouter>
                </AuthProvider>
            </QueryClientProvider>
        );

        // Should not show any loading state
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
});
