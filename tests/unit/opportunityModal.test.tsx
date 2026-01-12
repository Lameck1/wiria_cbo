/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */
// @vitest-environment jsdom

import { describe, it, beforeEach, afterEach, vi, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ApplicationFormModal } from '@/features/opportunities/components/ApplicationFormModal';
import type { Opportunity } from '@/features/opportunities/hooks/useOpportunities';

describe('ApplicationFormModal (opportunity application submission)', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  function renderModal() {
    const opportunity: Opportunity = {
      id: 'op123',
      title: 'Volunteer',
      category: 'Community',
      type: 'VOLUNTEER',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      location: 'Nairobi',
      duration: '3 months',
      summary: 'Short summary',
      description: 'Long description',
      requirements: [],
      responsibilities: [],
      benefits: [],
      deadline: new Date().toISOString(),
    };

    return render(
      <ApplicationFormModal opportunity={opportunity} isOpen onClose={() => {}} onBack={() => {}} />
    );
  }

  it('submits to /api/applications and shows success on valid submit', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as any);

    renderModal();

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '0712345678' } });
    fireEvent.change(screen.getByLabelText(/location\/county/i), { target: { value: 'Nairobi' } });
    fireEvent.change(screen.getByLabelText(/highest education level/i), {
      target: { value: 'bachelors' },
    });
    fireEvent.change(screen.getByLabelText(/field of study/i), {
      target: { value: 'Computer Science' },
    });
    fireEvent.change(screen.getByLabelText(/years of relevant experience/i), {
      target: { value: '1-3' },
    });
    fireEvent.change(screen.getByLabelText(/why are you interested in this position/i), {
      target: { value: 'Motivation text' },
    });
    fireEvent.change(screen.getByLabelText(/cv\/resume/i), {
      target: { value: 'https://drive.google.com/cv' },
    });
    fireEvent.change(screen.getByLabelText(/cover letter/i), {
      target: { value: 'https://drive.google.com/cover' },
    });
    await user.click(screen.getByRole('checkbox'));

    await user.click(screen.getByRole('button', { name: /submit application/i }));

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/applications',
      expect.objectContaining({ method: 'POST' })
    );

    const firstCall = fetchMock.mock.calls[0];
    expect(firstCall).toBeTruthy();
    const options = firstCall?.[1] as RequestInit | undefined;
    const body = options?.body;
    if (typeof body !== 'string') throw new Error('Expected request body to be a string');

    const payload = JSON.parse(body) as Record<string, unknown>;
    expect(payload).toEqual(
      expect.objectContaining({
        type: 'OPPORTUNITY',
        opportunityId: 'op123',
        email: 'test@example.com',
      })
    );

    expect(await screen.findByText(/application submitted!/i)).toBeInTheDocument();
  }, 15_000);

  it('shows error if submission fails', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: { message: 'Network error' } }),
    } as any);

    renderModal();

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '0712345678' } });
    fireEvent.change(screen.getByLabelText(/location\/county/i), { target: { value: 'Nairobi' } });
    fireEvent.change(screen.getByLabelText(/highest education level/i), {
      target: { value: 'bachelors' },
    });
    fireEvent.change(screen.getByLabelText(/field of study/i), {
      target: { value: 'Computer Science' },
    });
    fireEvent.change(screen.getByLabelText(/years of relevant experience/i), {
      target: { value: '1-3' },
    });
    fireEvent.change(screen.getByLabelText(/why are you interested in this position/i), {
      target: { value: 'Motivation text' },
    });
    fireEvent.change(screen.getByLabelText(/cv\/resume/i), {
      target: { value: 'https://drive.google.com/cv' },
    });
    fireEvent.change(screen.getByLabelText(/cover letter/i), {
      target: { value: 'https://drive.google.com/cover' },
    });
    await user.click(screen.getByRole('checkbox'));

    const maybeSubmit = screen.queryByRole('button', { name: /submit application/i });
    if (maybeSubmit) {
      await user.click(maybeSubmit);
    } else {
      const tryAgain = screen.queryByRole('button', { name: /try again/i });
      if (tryAgain) {
        await user.click(tryAgain);
      }
      await user.click(await screen.findByRole('button', { name: /submit application/i }));
    }

    expect(await screen.findByText(/submission failed/i)).toBeInTheDocument();
    expect(await screen.findByText(/network error/i)).toBeInTheDocument();
  }, 15_000);
});
