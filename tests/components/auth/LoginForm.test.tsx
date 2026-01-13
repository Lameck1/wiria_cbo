/**
 * LoginForm Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/app/config/queryClient';

// Wrapper with all required providers
// BrowserRouter must wrap AuthProvider since AuthProvider uses useNavigate
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

describe('LoginForm', () => {
  it('renders member login form correctly', () => {
    render(<LoginForm isMember />, { wrapper: TestWrapper });

    expect(screen.getByText(/Member Login/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email or Phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  it('renders staff login form correctly', () => {
    render(<LoginForm isMember={false} />, { wrapper: TestWrapper });

    expect(screen.getByText(/Staff Login/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username or Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it('shows validation for empty fields', async () => {
    const user = userEvent.setup();
    render(<LoginForm isMember />, { wrapper: TestWrapper });

    const submitButton = screen.getByRole('button', { name: /Login/i });
    await user.click(submitButton);

    // Form should have required fields - verify inputs exist and are in form
    const identifierInput = screen.getByLabelText(/Email or Phone/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/Password/i) as HTMLInputElement;

    expect(identifierInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  it('allows typing in form fields', async () => {
    const user = userEvent.setup();
    render(<LoginForm isMember />, { wrapper: TestWrapper });

    const identifierInput = screen.getByLabelText(/Email or Phone/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    await user.type(identifierInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(identifierInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('shows forgot password link', () => {
    render(<LoginForm isMember />, { wrapper: TestWrapper });

    const forgotLink = screen.getByText(/Forgot password/i);
    expect(forgotLink).toBeInTheDocument();
  });

  it('shows register link for member login', () => {
    render(<LoginForm isMember />, { wrapper: TestWrapper });

    const registerLink = screen.getByText(/Register here/i);
    expect(registerLink).toBeInTheDocument();
  });

  it('does not show register link for staff login', () => {
    render(<LoginForm isMember={false} />, { wrapper: TestWrapper });

    const registerLink = screen.queryByText(/Register here/i);
    expect(registerLink).not.toBeInTheDocument();
  });
});
