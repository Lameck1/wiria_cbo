/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */
// @vitest-environment jsdom

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, beforeEach, vi, expect } from 'vitest';

import NewsManagementPage from '@/pages/admin/NewsManagementPage';

vi.mock('@/features/admin/api/news.api', () => ({
  getAdminUpdates: vi.fn(),
  createUpdate: vi.fn(),
  updateUpdate: vi.fn(),
  deleteUpdate: vi.fn(),
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

import { getAdminUpdates, createUpdate, deleteUpdate } from '@/features/admin/api/news.api';
import { notificationService } from '@/shared/services/notification/notificationService';

describe('NewsManagementPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads and renders updates', async () => {
    const getAdminUpdatesMock = vi.mocked(getAdminUpdates);
    getAdminUpdatesMock.mockResolvedValue({
      data: [
        {
          id: '1',
          title: 'News 1',
          fullContent: 'Content 1',
          category: 'GENERAL',
          status: 'PUBLISHED',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'News 2',
          fullContent: 'Content 2',
          category: 'EVENT',
          status: 'DRAFT',
          createdAt: new Date().toISOString(),
        },
      ],
    });

    render(<NewsManagementPage />);

    expect(await screen.findByText('News 1')).toBeInTheDocument();
    expect(await screen.findByText('News 2')).toBeInTheDocument();
    expect(getAdminUpdates).toHaveBeenCalled();
  });

  it('opens modal and creates a new update', async () => {
    const user = userEvent.setup();
    const getAdminUpdatesMock = vi.mocked(getAdminUpdates);
    const createUpdateMock = vi.mocked(createUpdate);
    getAdminUpdatesMock.mockResolvedValue({ data: [] });
    createUpdateMock.mockResolvedValue({ success: true } as any);

    render(<NewsManagementPage />);

    await user.click(await screen.findByRole('button', { name: /post new update/i }));
    expect(screen.getByRole('heading', { name: /post new update/i })).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText(/new community program launch/i), 'New Title');
    await user.type(screen.getByPlaceholderText(/describe the update in detail/i), 'New Content');
    
    // Select category and status
    await user.selectOptions(screen.getByLabelText(/category/i), 'GENERAL');
    await user.selectOptions(screen.getByLabelText(/status/i), 'PUBLISHED');

    await user.click(screen.getByRole('button', { name: /save post/i }));

    await waitFor(() => {
      expect(createUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Title',
          fullContent: 'New Content',
          category: 'GENERAL',
          status: 'PUBLISHED',
        })
      );
      expect(notificationService.success).toHaveBeenCalled();
    });
  });

  it('deletes an update when confirmed', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const getAdminUpdatesMock = vi.mocked(getAdminUpdates);
    const deleteUpdateMock = vi.mocked(deleteUpdate);

    getAdminUpdatesMock.mockResolvedValue({
      data: [
        {
          id: '1',
          title: 'Delete Me',
          fullContent: '...',
          category: 'GENERAL',
          status: 'PUBLISHED',
          createdAt: new Date().toISOString(),
        },
      ],
    });
    deleteUpdateMock.mockResolvedValue({ success: true } as any);

    render(<NewsManagementPage />);

    await user.click(await screen.findByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(deleteUpdate).toHaveBeenCalledWith('1');
      expect(notificationService.success).toHaveBeenCalledWith('Update deleted successfully');
    });
  });
});
