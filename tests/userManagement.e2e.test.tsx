// @vitest-environment jsdom

import { describe, it, beforeEach, vi, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import ResetPasswordPage from '@/pages/ResetPasswordPage';
import { apiClient } from '@/shared/services/api/client';
import { AuthProvider } from '@/features/auth/context/AuthContext';

vi.mock('@/shared/services/notification/notificationService', () => ({
  notificationService: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
    handleError: vi.fn(),
  },
}));

import { notificationService } from '@/shared/services/notification/notificationService';

describe('ResetPasswordPage flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('requests reset link and moves to confirm step', async () => {
    const user = userEvent.setup();
    vi.spyOn(apiClient, 'post').mockResolvedValueOnce({ success: true });

    render(
      <MemoryRouter>
        <AuthProvider>
          <ResetPasswordPage />
        </AuthProvider>
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/email address/i), 'user@example.com');
    await user.click(screen.getByRole('button', { name: /send reset link/i }));

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalled();
      expect(notificationService.success).toHaveBeenCalledWith('Password reset link sent to your email!');
    });

    expect(await screen.findByText(/check your email/i)).toBeInTheDocument();
  });

  it('validates password mismatch before calling API', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <AuthProvider>
          <ResetPasswordPage />
        </AuthProvider>
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /enter token/i }));

    await user.type(screen.getByLabelText(/reset token/i), 'token123');
    await user.type(screen.getByLabelText(/new password/i), 'password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'password999');
    await user.click(screen.getByRole('button', { name: /reset password/i }));

    expect(notificationService.error).toHaveBeenCalledWith('Passwords do not match');
  });
});
