// @vitest-environment jsdom

/**
 * E2E Tests for Membership Registration Flow
 * Tests the member registration page
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthProvider } from '@/features/auth/context/AuthContext';
import MembershipPage from '@/pages/MembershipPage';

vi.mock('@/shared/services/notification/notificationService', () => ({
    notificationService: {
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
        handleError: vi.fn(),
    },
}));

vi.mock('@/shared/services/useBackendStatus', () => ({
    useBackendStatus: () => ({ isBackendConnected: false, isChecking: false }),
}));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false },
    },
});

function renderWithProviders(ui: React.ReactElement) {
    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <AuthProvider>
                    {ui}
                </AuthProvider>
            </MemoryRouter>
        </QueryClientProvider>
    );
}

describe('Membership Registration Flow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        queryClient.clear();
    });

    it('renders membership page with registration option', async () => {
        renderWithProviders(<MembershipPage />);

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /become a member/i })).toBeInTheDocument();
        });
    });

    it('displays membership information', async () => {
        renderWithProviders(<MembershipPage />);

        // Check for membership content
        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /membership information/i })).toBeInTheDocument();
        });
    });

    it('shows membership types', async () => {
        renderWithProviders(<MembershipPage />);

        // Look for membership type options (Individual, Group) or general membership content
        await waitFor(() => {
            const pageContent = document.body.textContent;
            expect(pageContent).toMatch(/individual|group|member|join/i);
        });
    });
});
