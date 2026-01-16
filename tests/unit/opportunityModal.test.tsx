/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */
// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, beforeEach, afterEach, vi, expect } from 'vitest';

import { ApplicationModal } from '@/features/applications/components/ApplicationModal';
import type { Opportunity } from '@/features/opportunities/hooks/useOpportunities';
import { apiClient } from '@/shared/services/api/client';

// Mock apiClient
vi.mock('@/shared/services/api/client', () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

// Mock the backend status to always be true
vi.mock('@/shared/services/backendStatus', () => ({
  useBackendStatus: () => ({ isBackendConnected: true, isChecking: false }),
}));

describe('ApplicationModal integration test (form submission)', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
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
      <ApplicationModal
        title={opportunity.title}
        itemId={opportunity.id}
        type="OPPORTUNITY"
        isOpen
        onClose={() => {}}
        onBack={() => {}}
      />
    );
  }

  it('submits correctly and shows success', async () => {
    const user = userEvent.setup();
    const postMock = vi.mocked(apiClient.post);
    postMock.mockResolvedValueOnce({});

    renderModal();

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '0712345678' } });
    fireEvent.change(screen.getByLabelText(/location\/county/i), { target: { value: 'Nairobi' } });

    // Selects
    fireEvent.change(screen.getByLabelText(/highest education level/i), {
      target: { value: 'bachelors' },
    });
    fireEvent.change(screen.getByLabelText(/years of relevant experience/i), {
      target: { value: '1-3' },
    });

    fireEvent.change(screen.getByLabelText(/field of study/i), {
      target: { value: 'Computer Science' },
    });
    fireEvent.change(screen.getByLabelText(/why are you interested/i), {
      target: {
        value:
          'A very long motivation text that is definitely more than one hundred characters long to satisfy the zod validation schema requirements.',
      },
    });
    fireEvent.change(screen.getByLabelText(/cv\/resume/i), {
      target: { value: 'https://drive.google.com/cv' },
    });

    await user.click(screen.getByRole('checkbox'));

    await user.click(screen.getByRole('button', { name: /submit application/i }));

    expect(postMock).toHaveBeenCalledWith(
      '/applications',
      expect.objectContaining({
        type: 'OPPORTUNITY',
        opportunityId: 'op123',
      })
    );

    expect(await screen.findByText(/application submitted!/i)).toBeInTheDocument();
  }, 15_000);
});
