// @vitest-environment jsdom

/**
 * E2E Tests for Contact Page Flow
 * Tests the contact form submission process
 */
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, beforeEach, vi, expect } from 'vitest';

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

vi.mock('@/shared/services/useBackendStatus', () => ({
    useBackendStatus: () => ({ isBackendConnected: true, isChecking: false }),
}));

describe('Contact Page Flow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders contact page with hero', () => {
        render(
            <MemoryRouter>
                <ContactPage />
            </MemoryRouter>
        );

        expect(screen.getByText('Contact Us')).toBeInTheDocument();
    });

    it('displays send message section', () => {
        render(
            <MemoryRouter>
                <ContactPage />
            </MemoryRouter>
        );

        expect(screen.getByText('Send us a Message')).toBeInTheDocument();
    });

    it('shows contact form fields', () => {
        render(
            <MemoryRouter>
                <ContactPage />
            </MemoryRouter>
        );

        // Check for form field labels
        expect(screen.getByText(/full name/i)).toBeInTheDocument();
        expect(screen.getByText(/email address/i)).toBeInTheDocument();
        expect(screen.getByText(/subject/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    });

    it('has submit button', () => {
        render(
            <MemoryRouter>
                <ContactPage />
            </MemoryRouter>
        );

        expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
    });
});
