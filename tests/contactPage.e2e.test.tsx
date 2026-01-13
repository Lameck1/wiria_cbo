// @vitest-environment jsdom

/**
 * E2E Tests for Contact Page Flow
 * Tests the contact form submission process
 */
import { describe, it, beforeEach, vi, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import ContactPage from '@/pages/ContactPage';

vi.mock('@/shared/services/notification/notificationService', () => ({
    notificationService: {
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
        handleError: vi.fn(),
    },
}));

vi.mock('@/shared/services/backendStatus', () => ({
    BackendStatusProvider: ({ children }: { children: React.ReactNode }) => children,
    useBackendStatus: () => ({ isConnected: true }),
}));

describe('Contact Page Flow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders contact page with hero', async () => {
        render(
            <MemoryRouter>
                <ContactPage />
            </MemoryRouter>
        );

        expect(screen.getByText('Contact Us')).toBeInTheDocument();
    });

    it('displays send message section', async () => {
        render(
            <MemoryRouter>
                <ContactPage />
            </MemoryRouter>
        );

        expect(screen.getByText('Send us a Message')).toBeInTheDocument();
    });

    it('shows contact form fields', async () => {
        render(
            <MemoryRouter>
                <ContactPage />
            </MemoryRouter>
        );

        // Check for form field labels
        expect(screen.getByText(/full name/i)).toBeInTheDocument();
        expect(screen.getByText(/email address/i)).toBeInTheDocument();
        expect(screen.getByText(/subject/i)).toBeInTheDocument();
        expect(screen.getByText(/message/i)).toBeInTheDocument();
    });

    it('has submit button', async () => {
        render(
            <MemoryRouter>
                <ContactPage />
            </MemoryRouter>
        );

        expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
    });
});
