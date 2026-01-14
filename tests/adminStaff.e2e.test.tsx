/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */
// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, beforeEach, vi, expect } from 'vitest';

import { getUsers, inviteUser, updateUserStatus } from '@/features/admin/api/users.api';
import UserManagementPage from '@/pages/admin/UserManagementPage';
import { notificationService } from '@/shared/services/notification/notificationService';
import { UserRole } from '@/shared/types';

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
      <MemoryRouter initialEntries={['/admin/users']}>{children}</MemoryRouter>
    </QueryClientProvider>
  );
}

vi.mock('@/features/admin/api/users.api', () => ({
  getUsers: vi.fn(),
  getInvitations: vi.fn(),
  updateUserStatus: vi.fn(),
  cancelInvitation: vi.fn(),
  inviteUser: vi.fn(),
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


describe('UserManagementPage (staff & admin management)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads and renders active users', async () => {
    const getUsersMock = vi.mocked(getUsers);
    getUsersMock.mockResolvedValue([
      {
        id: 'u1',
        email: 'staff1@wiria.org',
        username: 'staff1',
        firstName: 'Staff',
        lastName: 'One',
        role: UserRole.STAFF,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'u2',
        email: 'admin@wiria.org',
        username: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.SUPER_ADMIN,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      },
    ]);

    render(<UserManagementPage />, { wrapper: TestWrapper });

    expect(await screen.findByText('staff1@wiria.org')).toBeInTheDocument();
    expect(await screen.findByText('admin@wiria.org')).toBeInTheDocument();
    expect(getUsers).toHaveBeenCalled();
  });

  it('opens invite modal and invites a new user', async () => {
    const user = userEvent.setup();
    const getUsersMock = vi.mocked(getUsers);
    const inviteUserMock = vi.mocked(inviteUser);
    getUsersMock.mockResolvedValue([]);
    inviteUserMock.mockResolvedValue({ success: true } as any);

    render(<UserManagementPage />, { wrapper: TestWrapper });

    await user.click(await screen.findByRole('button', { name: /invite user/i }));
    expect(screen.getByRole('heading', { name: /invite new user/i })).toBeInTheDocument();

    const emailInput = document.querySelector('input[name="email"]');
    const firstNameInput = document.querySelector('input[name="firstName"]');
    const lastNameInput = document.querySelector('input[name="lastName"]');
    const roleSelect = document.querySelector('select[name="role"]');

    expect(emailInput).toBeTruthy();
    expect(firstNameInput).toBeTruthy();
    expect(lastNameInput).toBeTruthy();
    expect(roleSelect).toBeTruthy();

    await user.type(emailInput as HTMLInputElement, 'new@wiria.org');
    await user.type(firstNameInput as HTMLInputElement, 'New');
    await user.type(lastNameInput as HTMLInputElement, 'Staff');
    await user.selectOptions(roleSelect as HTMLSelectElement, 'STAFF');

    await user.click(screen.getByRole('button', { name: /send invitation/i }));

    await waitFor(() => {
      expect(inviteUser).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'new@wiria.org',
          role: 'STAFF',
          firstName: 'New',
          lastName: 'Staff',
        })
      );
      expect(notificationService.success).toHaveBeenCalledWith('Invitation sent to new@wiria.org');
    });
  });

  it('deactivates a user when confirmed', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const getUsersMock = vi.mocked(getUsers);
    const updateUserStatusMock = vi.mocked(updateUserStatus);

    getUsersMock.mockResolvedValue([
      {
        id: 'u1',
        email: 'staff@wiria.org',
        username: 'staff',
        firstName: 'Staff',
        lastName: 'User',
        role: UserRole.STAFF,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      },
    ]);
    updateUserStatusMock.mockResolvedValue({ success: true } as any);

    render(<UserManagementPage />, { wrapper: TestWrapper });

    await user.click(await screen.findByRole('button', { name: /deactivate/i }));

    await waitFor(() => {
      expect(updateUserStatus).toHaveBeenCalledWith('staff@wiria.org', 'SUSPENDED');
      expect(notificationService.success).toHaveBeenCalledWith('User status updated');
    });
  });
});
