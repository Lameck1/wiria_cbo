import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import SafeguardingPage from '@/pages/SafeguardingPage';
import { emailJsService } from '@/shared/services/emailJsService';
import { logger } from '@/shared/services/logger';
import { notificationService } from '@/shared/services/notification/notificationService';
import { useBackendStatus } from '@/shared/services/useBackendStatus';

const server = setupServer();

vi.mock('@/shared/services/useBackendStatus');
vi.mock('@/shared/services/emailJsService');
vi.mock('@/shared/services/notification/notificationService');
vi.mock('@/shared/services/logger');

describe('SafeguardingPage', () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'warn' });
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useBackendStatus).mockReturnValue({
      isBackendConnected: true,
      isChecking: false,
    });
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  it('allows user to submit a safeguarding report and shows success view', async () => {
    server.use(
      http.post('*/safeguarding', async ({ request }) => {
        const formData = await request.formData();

        expect(formData.get('reporterName')).toBe('Test Reporter');
        expect(formData.get('reporterEmail')).toBe('reporter@example.com');

        return HttpResponse.json({ data: { referenceNumber: 'SAFE-123' } });
      })
    );

    const user = userEvent.setup();

    render(
      <HelmetProvider>
        <MemoryRouter>
          <SafeguardingPage />
        </MemoryRouter>
      </HelmetProvider>
    );

    await user.type(screen.getByLabelText(/your name/i), 'Test Reporter');
    await user.type(screen.getByLabelText(/your email/i), 'reporter@example.com');

    await user.click(
      screen.getByRole('button', {
        name: /continue to concern details/i,
      })
    );

    const categoryButton = await screen.findByText('Child Protection');
    await user.click(categoryButton);

    await user.type(
      screen.getByLabelText(/description/i),
      'This is a sufficiently detailed description of the concern.'
    );

    await user.click(
      screen.getByRole('button', {
        name: /submit report/i,
      })
    );

    await waitFor(() => {
      expect(screen.getByText(/report submitted successfully/i)).toBeInTheDocument();
      expect(screen.getByText('SAFE-123')).toBeInTheDocument();
    });
  }, 10000);

  it('allows anonymous reporting without personal details', async () => {
    server.use(
      http.post('*/safeguarding', async ({ request }) => {
        const formData = await request.formData();

        expect(formData.get('isAnonymous')).toBe('true');
        expect(formData.get('reporterName')).toBeNull();
        expect(formData.get('reporterEmail')).toBeNull();

        return HttpResponse.json({ data: { referenceNumber: 'SAFE-ANON-1' } });
      })
    );

    const user = userEvent.setup();

    render(
      <HelmetProvider>
        <MemoryRouter>
          <SafeguardingPage />
        </MemoryRouter>
      </HelmetProvider>
    );

    await user.click(screen.getByLabelText(/report anonymously/i));

    await user.click(
      screen.getByRole('button', {
        name: /continue to concern details/i,
      })
    );

    const categoryButton = await screen.findByText('Child Protection');
    await user.click(categoryButton);

    await user.type(
      screen.getByLabelText(/description/i),
      'This is a sufficiently detailed description of the concern.'
    );

    await user.click(
      screen.getByRole('button', {
        name: /submit report/i,
      })
    );

    await waitFor(() => {
      expect(screen.getByText(/report submitted successfully/i)).toBeInTheDocument();
      expect(screen.getByText('SAFE-ANON-1')).toBeInTheDocument();
    });
  }, 10000);

  it('allows user to lookup a report and shows status result', async () => {
    server.use(
      http.post('*/safeguarding/lookup', async ({ request }) => {
        const body = (await request.json()) as { referenceNumber: string; email?: string };

        expect(body.referenceNumber).toBe('SAFE-999');
        expect(body.email).toBe('user@example.com');

        return HttpResponse.json({
          data: {
            referenceNumber: 'SAFE-999',
            status: 'UNDER_REVIEW',
            category: 'ABUSE',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-02T00:00:00Z',
          },
        });
      })
    );

    const user = userEvent.setup();

    render(
      <HelmetProvider>
        <MemoryRouter>
          <SafeguardingPage />
        </MemoryRouter>
      </HelmetProvider>
    );

    await user.type(screen.getByLabelText(/reference number/i), 'SAFE-999');
    await user.type(screen.getByLabelText(/email \(if provided\)/i), 'user@example.com');
    await user.keyboard('{Enter}');

    await screen.findByText(/under review/i);
  });

  it('shows error message when lookup report is not found', async () => {
    server.use(
      http.post('*/safeguarding/lookup', () => {
        return HttpResponse.json({ message: 'Not found' }, { status: 404 });
      })
    );

    const user = userEvent.setup();

    render(
      <HelmetProvider>
        <MemoryRouter>
          <SafeguardingPage />
        </MemoryRouter>
      </HelmetProvider>
    );

    await user.type(screen.getByLabelText(/reference number/i), 'SAFE-000');
    await user.keyboard('{Enter}');

    await screen.findByText(/report not found\. please check your reference number\./i);
  });

  it('falls back to EmailJS when backend is offline and shows success view', async () => {
    vi.mocked(useBackendStatus).mockReturnValue({
      isBackendConnected: false,
      isChecking: false,
    });

    vi.mocked(emailJsService.sendSafeguardingReport).mockResolvedValue({
      status: 'SUCCESS',
      message: 'Fallback ok',
    } as never);

    const user = userEvent.setup();

    render(
      <HelmetProvider>
        <MemoryRouter>
          <SafeguardingPage />
        </MemoryRouter>
      </HelmetProvider>
    );

    await user.type(screen.getByLabelText(/your name/i), 'Test Reporter');
    await user.type(screen.getByLabelText(/your email/i), 'reporter@example.com');

    await user.click(
      screen.getByRole('button', {
        name: /continue to concern details/i,
      })
    );

    const categoryButton = await screen.findByText('Child Protection');
    await user.click(categoryButton);

    await user.type(
      screen.getByLabelText(/description/i),
      'This is a sufficiently detailed description of the concern.'
    );

    await user.click(
      screen.getByRole('button', {
        name: /submit report/i,
      })
    );

    await waitFor(() => {
      expect(emailJsService.sendSafeguardingReport).toHaveBeenCalledTimes(1);
      expect(screen.getByText(/report submitted successfully/i)).toBeInTheDocument();
    });
  }, 10000);

  it('shows error notification when EmailJS submission fails while backend is offline', async () => {
    vi.mocked(useBackendStatus).mockReturnValue({
      isBackendConnected: false,
      isChecking: false,
    });

    vi.mocked(emailJsService.sendSafeguardingReport).mockResolvedValue({
      status: 'PROVIDER_ERROR',
      message: 'EmailJS error',
    } as never);

    const user = userEvent.setup();

    render(
      <HelmetProvider>
        <MemoryRouter>
          <SafeguardingPage />
        </MemoryRouter>
      </HelmetProvider>
    );

    await user.type(screen.getByLabelText(/your name/i), 'Test Reporter');
    await user.type(screen.getByLabelText(/your email/i), 'reporter@example.com');

    await user.click(
      screen.getByRole('button', {
        name: /continue to concern details/i,
      })
    );

    const categoryButton = await screen.findByText('Child Protection');
    await user.click(categoryButton);

    await user.type(
      screen.getByLabelText(/description/i),
      'This is a sufficiently detailed description of the concern.'
    );

    await user.click(
      screen.getByRole('button', {
        name: /submit report/i,
      })
    );

    await waitFor(() => {
      expect(emailJsService.sendSafeguardingReport).toHaveBeenCalledTimes(1);
      expect(logger.error).toHaveBeenCalledWith(
        '[useSafeguardingReport] EmailJS submission failed',
        expect.anything()
      );
      expect(notificationService.error).toHaveBeenCalledWith(
        'Failed to submit report via our alternative channel. Please try again later.'
      );
    });
  }, 10000);
});
