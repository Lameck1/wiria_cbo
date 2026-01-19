// @vitest-environment jsdom

/**
 * Enhanced E2E Tests for Complete Donation Flow
 * Tests the entire user journey from landing to donation completion
 */
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';


import DonationsPage from '@/pages/DonationsPage';
import { ServiceProvider, createMockServiceContainer } from '@/shared/services/di';

import type * as FramerMotion from 'framer-motion';

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof FramerMotion>('framer-motion');
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
      section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
      span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
      h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

vi.mock('@/shared/services/useBackendStatus', () => ({
  useBackendStatus: vi.fn(() => ({
    isBackendConnected: true,
    isChecking: false,
  })),
}));

const mockServices = createMockServiceContainer({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    setTokenResolver: vi.fn(),
    setUnauthorizedCallback: vi.fn(),
  },
  notificationService: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    clearAll: vi.fn(),
  },
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
  storageService: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
});

function renderWithRouter(ui: React.ReactElement, { route = '/' } = {}) {
  return render(
    <ServiceProvider services={mockServices}>
      <HelmetProvider>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path={route} element={ui} />
            <Route path="/donate/success" element={<div>Donation Success</div>} />
            <Route path="/donate/cancel" element={<div>Donation Cancelled</div>} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    </ServiceProvider>
  );
}

describe('Complete Donation Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock IntersectionObserver
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null
    });
    window.IntersectionObserver = mockIntersectionObserver;

    // Mock successful API responses
    mockServices.apiClient.post = vi.fn().mockResolvedValue({
      data: {
        donation: { id: 'donation-123' },
        checkoutRequestId: 'checkout-456',
        message: 'Donation initiated successfully',
      },
    });
  });

  it.skip('completes full donation flow with STK Push', async () => {
    const user = userEvent.setup();

    // 1. User lands on donations page
    renderWithRouter(<DonationsPage />, { route: '/donate' });

    // 2. Verify donation page loads correctly
    await waitFor(() => {
      expect(screen.getByText(/your support/i)).toBeInTheDocument();
      expect(screen.getByText(/saves lives/i)).toBeInTheDocument();
    });

    // 3. User selects donation amount
    const amountButton = screen.getByRole('button', { name: /ksh 1,000/i });
    await user.click(amountButton);

    // 4. User enters personal details
    const nameInput = screen.getByPlaceholderText(/your name/i);
    const emailInput = screen.getByPlaceholderText(/your email/i);
    const phoneInput = screen.getByPlaceholderText(/your phone/i);

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john.doe@example.com');
    await user.type(phoneInput, '0712345678');

    // 5. User selects STK Push payment method
    const stkPushOption = screen.getByRole('radio', { name: /stk push/i });
    await user.click(stkPushOption);

    // 6. User submits donation form
    const submitButton = screen.getByRole('button', { name: /donate now/i });
    await user.click(submitButton);

    // 7. Verify API call was made
    await waitFor(() => {
      expect(mockServices.apiClient.post).toHaveBeenCalledWith('/donations', expect.objectContaining({
        amount: 1000,
        donorName: 'John Doe',
        donorEmail: 'john.doe@example.com',
        donorPhone: '0712345678',
        paymentMethod: 'STK_PUSH',
      }));
    });

    // 8. Verify success notification
    await waitFor(() => {
      expect(mockServices.notificationService.success).toHaveBeenCalledWith(
        expect.stringContaining('Donation initiated successfully')
      );
    });
  });

  it.skip('handles donation with manual payment method', async () => {
    const user = userEvent.setup();

    renderWithRouter(<DonationsPage />, { route: '/donate' });

    // Select manual payment method
    const manualOption = screen.getByRole('radio', { name: /manual payment/i });
    await user.click(manualOption);

    // Fill in donation details
    const amountButton = screen.getByRole('button', { name: /ksh 500/i });
    await user.click(amountButton);

    const nameInput = screen.getByPlaceholderText(/your name/i);
    const emailInput = screen.getByPlaceholderText(/your email/i);

    await user.type(nameInput, 'Jane Smith');
    await user.type(emailInput, 'jane.smith@example.com');

    // Submit donation
    const submitButton = screen.getByRole('button', { name: /donate now/i });
    await user.click(submitButton);

    // Verify manual payment handling
    await waitFor(() => {
      expect(mockServices.apiClient.post).toHaveBeenCalledWith('/donations', expect.objectContaining({
        amount: 500,
        donorName: 'Jane Smith',
        donorEmail: 'jane.smith@example.com',
        paymentMethod: 'MANUAL',
      }));
    });
  });

  it.skip('validates required fields before submission', async () => {
    const user = userEvent.setup();

    renderWithRouter(<DonationsPage />, { route: '/donate' });

    // Try to submit without filling any fields
    const submitButton = screen.getByRole('button', { name: /donate now/i });
    await user.click(submitButton);

    // Verify no API call was made
    expect(mockServices.apiClient.post).not.toHaveBeenCalled();

    // Verify error notification (if validation is implemented)
    // This would depend on the actual validation implementation
  });

  it.skip('handles API errors gracefully', async () => {
    const user = userEvent.setup();

    // Mock API error
    mockServices.apiClient.post = vi.fn().mockRejectedValue(new Error('Network error'));

    renderWithRouter(<DonationsPage />, { route: '/donate' });

    // Fill and submit form
    const amountButton = screen.getByRole('button', { name: /ksh 2,000/i });
    await user.click(amountButton);

    const nameInput = screen.getByPlaceholderText(/your name/i);
    const emailInput = screen.getByPlaceholderText(/your email/i);
    const phoneInput = screen.getByPlaceholderText(/your phone/i);

    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(phoneInput, '0722000000');

    const submitButton = screen.getByRole('button', { name: /donate now/i });
    await user.click(submitButton);

    // Verify error handling
    await waitFor(() => {
      expect(mockServices.notificationService.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed')
      );
    });
  });

  it('displays bank details for manual payments', async () => {
    const user = userEvent.setup();

    // Mock scrollIntoView
    const mockScrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = mockScrollIntoView;

    renderWithRouter(<DonationsPage />, { route: '/donate' });

    // Click on bank details button
    const bankDetailsButton = screen.getByRole('button', { name: /view bank details/i });
    await user.click(bankDetailsButton);

    // Verify scrollIntoView was called
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });

    // Verify bank details are displayed
    await waitFor(() => {
      // Check if the section exists first
      const bankDetails = document.getElementById('bank-details');
      expect(bankDetails).toBeInTheDocument();

      if (bankDetails) {
        const scoped = within(bankDetails);
        expect(scoped.getByText(/direct bank deposit/i)).toBeInTheDocument();
        expect(scoped.getByText(/account number/i)).toBeInTheDocument();
        expect(scoped.getByText(/account name/i)).toBeInTheDocument();
      }
    });
  });
});
