// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getAdminCareers } from '@/features/admin/api/careers.api';
import { getAdminOpportunities, getApplications } from '@/features/admin/api/opportunities.api';
import HRManagementPage from '@/pages/admin/hrManagementPage';

// Create a fresh QueryClient for tests
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

// Test wrapper with required providers
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={createTestQueryClient()}>
      <MemoryRouter initialEntries={['/admin/hr']}>{children}</MemoryRouter>
    </QueryClientProvider>
  );
}

vi.mock('@/features/admin/api/careers.api', () => ({
  getAdminCareers: vi.fn(),
  createCareer: vi.fn(),
  updateCareer: vi.fn(),
  deleteCareer: vi.fn(),
}));

vi.mock('@/features/admin/api/opportunities.api', () => ({
  getAdminOpportunities: vi.fn(),
  getApplications: vi.fn(),
  createOpportunity: vi.fn(),
  updateOpportunity: vi.fn(),
  deleteOpportunity: vi.fn(),
  updateApplicationStatus: vi.fn(),
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

describe('HRManagementPage (careers + applications)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads careers and shows an applicant in Applications tab', async () => {
    const getAdminCareersMock = vi.mocked(getAdminCareers);
    const getAdminOpportunitiesMock = vi.mocked(getAdminOpportunities);
    const getApplicationsMock = vi.mocked(getApplications);

    getAdminCareersMock.mockResolvedValue({
      data: [
        {
          id: '1',
          title: 'Job 1',
          employmentType: 'FULL_TIME',
          location: 'Nairobi',
          deadline: new Date().toISOString(),
          summary: 'Summary',
          description: 'Desc',
          requirements: [],
          responsibilities: [],
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
        },
      ],
    });

    getAdminOpportunitiesMock.mockResolvedValue({ data: [] });

    getApplicationsMock.mockResolvedValue({
      data: [
        {
          id: 'a1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '254712345678',
          status: 'PENDING',
          coverLetter: '...',
          createdAt: new Date().toISOString(),
          careerId: '1',
          career: { title: 'Job 1' },
        },
      ],
    });

    render(<HRManagementPage />, { wrapper: TestWrapper });

    expect(await screen.findByText('HR & Talent Management')).toBeInTheDocument();
    expect(await screen.findByText('Job 1')).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /applications/i }));

    expect(await screen.findByText(/john doe/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(getAdminCareers).toHaveBeenCalled();
      expect(getApplications).toHaveBeenCalled();
    });
  });
});
