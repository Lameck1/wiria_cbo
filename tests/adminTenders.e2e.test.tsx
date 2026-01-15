/* eslint-disable @typescript-eslint/no-non-null-assertion */
// @vitest-environment jsdom

import type { ReactElement } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, beforeEach, vi, expect } from 'vitest';


import TenderManagementPage from '@/pages/admin/TenderManagementPage';
import type { Tender } from '@/features/admin/api/tenders.api';

vi.mock('@/features/admin/api/tenders.api', () => ({
  getTenders: vi.fn(),
  createTender: vi.fn(),
  updateTender: vi.fn(),
  deleteTender: vi.fn(),
}));

vi.mock('@/features/admin/api/resources.api', () => ({
  uploadFile: vi.fn(),
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

import { getTenders, createTender } from '@/features/admin/api/tenders.api';
import { notificationService } from '@/shared/services/notification/notificationService';

function renderWithQueryClient(ui: ReactElement) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

describe('TenderManagementPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads and renders tenders', async () => {
    const getTendersMock = vi.mocked(getTenders);
    getTendersMock.mockResolvedValue({
      data: [
        {
          id: '1',
          title: 'Tender 1',
          refNo: 'REF01',
          deadline: new Date().toISOString(),
          status: 'OPEN',
          downloadUrl: undefined,
        },
      ] as Tender[],
    });

    renderWithQueryClient(<TenderManagementPage />);

    expect(await screen.findByText('Tender 1')).toBeInTheDocument();
    expect(await screen.findByText('REF01')).toBeInTheDocument();
    expect(getTenders).toHaveBeenCalledWith({ all: true });
  });

  it('opens modal and creates a tender', async () => {
    const user = userEvent.setup();
    const getTendersMock = vi.mocked(getTenders);
    const createTenderMock = vi.mocked(createTender);
    getTendersMock.mockResolvedValue({ data: [] });
    createTenderMock.mockResolvedValue({ success: true } as { success: boolean });

    renderWithQueryClient(<TenderManagementPage />);

    await user.click(await screen.findByRole('button', { name: /advertise new tender/i }));
    expect(screen.getByRole('heading', { name: /advertise new tender/i })).toBeInTheDocument();

    const titleInput = screen.getByLabelText(/tender title/i);
    const refNoInput = screen.getByLabelText(/reference no/i);
    const categoryInput = screen.getByLabelText(/^category/i);
    const deadlineInput = screen.getByLabelText(/deadline/i);
    const contactPersonInput = screen.getByLabelText(/contact person/i);
    const contactPhoneInput = screen.getByLabelText(/contact phone/i);
    const descriptionInput = screen.getByLabelText(/full description/i);

    await user.type(titleInput, 'New Bridge');
    await user.type(refNoInput, 'B001');
    await user.type(categoryInput, 'Infrastructure');
    fireEvent.change(deadlineInput, { target: { value: '2025-12-31T23:59' } });

    await user.type(contactPersonInput, 'Jane Doe');
    await user.type(contactPhoneInput, '0712345678');
    await user.type(descriptionInput, 'Tender description');

    await user.click(screen.getByRole('button', { name: /advertise tender/i }));

    await waitFor(() => {
      expect(createTender).toHaveBeenCalled();
      expect(notificationService.success).toHaveBeenCalledWith('Tender advertised');
    });
  });
});
