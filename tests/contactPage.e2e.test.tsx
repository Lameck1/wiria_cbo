// @vitest-environment jsdom

/**
 * E2E Tests for Contact Page Flow
 * Tests the contact form submission process
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, beforeEach, vi, expect } from 'vitest';

import ContactPage from '@/pages/ContactPage';
import { apiClient } from '@/shared/services/api/client';
import { notificationService } from '@/shared/services/notification/notificationService';

vi.mock('@/shared/services/api/client', () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

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
      <HelmetProvider>
        <MemoryRouter>
          <ContactPage />
        </MemoryRouter>
      </HelmetProvider>
    );

    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  it('displays send message section', () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <ContactPage />
        </MemoryRouter>
      </HelmetProvider>
    );

    expect(screen.getByText('Send us a Message')).toBeInTheDocument();
  });

  it('shows contact form fields', () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <ContactPage />
        </MemoryRouter>
      </HelmetProvider>
    );

    // Check for form field labels
    expect(screen.getByText(/full name/i)).toBeInTheDocument();
    expect(screen.getByText(/email address/i)).toBeInTheDocument();
    expect(screen.getByText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it('has submit button', () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <ContactPage />
        </MemoryRouter>
      </HelmetProvider>
    );

    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('validates required fields before submission', async () => {
    const user = userEvent.setup();
    render(
      <HelmetProvider>
        <MemoryRouter>
          <ContactPage />
        </MemoryRouter>
      </HelmetProvider>
    );

    // Click submit without filling fields
    await user.click(screen.getByRole('button', { name: /send message/i }));

    // Verify validation errors (HTML5 validation or custom validation)
    // Note: Since standard HTML5 validation prevents submission, we check if API was NOT called
    expect(apiClient.post).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.post).mockResolvedValue({ data: { success: true } });

    render(
      <HelmetProvider>
        <MemoryRouter>
          <ContactPage />
        </MemoryRouter>
      </HelmetProvider>
    );

    // Fill form
    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
    await user.type(screen.getByLabelText(/subject/i), 'Test Subject');
    await user.type(screen.getByLabelText(/message/i), 'This is a test message');

    // Submit
    await user.click(screen.getByRole('button', { name: /send message/i }));

    // Verify API call
    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/contact', {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message',
      });
    });

    // Verify success notification
    await waitFor(() => {
      expect(notificationService.success).toHaveBeenCalledWith(
        expect.stringMatching(/thank you/i)
      );
    });
  });

  it('handles API errors gracefully', async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.post).mockRejectedValue(new Error('Network error'));

    render(
      <HelmetProvider>
        <MemoryRouter>
          <ContactPage />
        </MemoryRouter>
      </HelmetProvider>
    );

    // Fill form
    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
    await user.type(screen.getByLabelText(/subject/i), 'Test Subject');
    await user.type(screen.getByLabelText(/message/i), 'This is a test message');

    // Submit
    await user.click(screen.getByRole('button', { name: /send message/i }));

    // Verify error notification
    await waitFor(() => {
      expect(notificationService.error).toHaveBeenCalledWith(
        expect.stringMatching(/failed/i)
      );
    });
  });
});
