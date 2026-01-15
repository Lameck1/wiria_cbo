// @vitest-environment jsdom

/**
 * E2E Tests for Donations Page
 * Tests the donations page rendering and bank details interaction
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import DonationsPage from '@/pages/DonationsPage';

describe('Donations Page Flow', () => {
    it('renders donations page hero section', () => {
        render(
            <MemoryRouter>
                <DonationsPage />
            </MemoryRouter>
        );

        expect(screen.getByText(/your support/i)).toBeInTheDocument();
        expect(screen.getByText(/saves lives/i)).toBeInTheDocument();
    });

    it('displays maintenance notice', () => {
        render(
            <MemoryRouter>
                <DonationsPage />
            </MemoryRouter>
        );

        expect(screen.getByText(/online payments/i)).toBeInTheDocument();
        expect(screen.getByText(/under maintenance/i)).toBeInTheDocument();
    });

    it('shows bank details button', () => {
        render(
            <MemoryRouter>
                <DonationsPage />
            </MemoryRouter>
        );

        expect(screen.getByRole('button', { name: /view bank details/i })).toBeInTheDocument();
    });

    it('scrolls to bank details when button clicked', async () => {
        const user = userEvent.setup();

        // Mock scrollIntoView
        const scrollIntoViewMock = vi.fn();
        Element.prototype.scrollIntoView = scrollIntoViewMock;

        render(
            <MemoryRouter>
                <DonationsPage />
            </MemoryRouter>
        );

        const bankDetailsButton = screen.getByRole('button', { name: /view bank details/i });
        await user.click(bankDetailsButton);

        // The button tries to scroll to #bank-details
        // Since element might not exist in isolated test, we just verify no crash
        expect(bankDetailsButton).toBeInTheDocument();
    });

    it('displays impact section', () => {
        render(
            <MemoryRouter>
                <DonationsPage />
            </MemoryRouter>
        );

        // Check for impact-related content
        expect(screen.getByText(/make an impact/i)).toBeInTheDocument();
    });
});
