/**
 * Reset Password Page
 * Password reset request and confirmation
 */

import { useState } from 'react';

import { Link } from 'react-router-dom';

import { Button } from '@/shared/components/ui/Button';
import { Card, CardBody } from '@/shared/components/ui/Card';
import { Input } from '@/shared/components/ui/Input';
import { apiClient } from '@/shared/services/api/client';
import { API_ENDPOINTS } from '@/shared/services/api/endpoints';
import { notificationService } from '@/shared/services/notification/notificationService';

type Step = 'request' | 'confirm' | 'success';

function ResetPasswordPage() {
  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiClient.post(API_ENDPOINTS.AUTH_RESET_PASSWORD_REQUEST, { email });
      notificationService.success('Password reset link sent to your email!');
      setStep('confirm');
    } catch (error) {
      notificationService.error(
        'Failed to send reset link. Please check your email and try again.'
      );
      console.error('Reset request error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      notificationService.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      notificationService.error('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.post(API_ENDPOINTS.AUTH_RESET_PASSWORD_CONFIRM, {
        token,
        newPassword,
      });
      notificationService.success('Password reset successfully!');
      setStep('success');
    } catch (error) {
      notificationService.error('Failed to reset password. Token may be invalid or expired.');
      console.error('Reset confirm error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <Card>
          <CardBody className="p-8">
            {/* Request Step */}
            {step === 'request' && (
              <>
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-wiria-yellow/10">
                    <svg
                      className="h-8 w-8 text-wiria-yellow"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-wiria-blue-dark">Reset Password</h1>
                  <p className="mt-2 text-gray-500">Enter your email to receive a password reset link</p>
                </div>

                <form onSubmit={(e) => void handleRequestReset(e)} className="space-y-6">
                  <Input
                    type="email"
                    label="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />

                  <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
                    Send Reset Link
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Already have a reset token?{' '}
                    <button
                      onClick={() => setStep('confirm')}
                      className="font-semibold text-wiria-blue-dark hover:text-wiria-yellow"
                    >
                      Enter token
                    </button>
                  </p>
                </div>
              </>
            )}

            {/* Confirm Step */}
            {step === 'confirm' && (
              <>
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <svg
                      className="h-8 w-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-wiria-blue-dark">Check Your Email</h1>
                  <p className="mt-2 text-gray-500">Enter the token from your email and set a new password</p>
                </div>

                <form onSubmit={(e) => void handleConfirmReset(e)} className="space-y-6">
                  <Input
                    label="Reset Token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter token from email"
                    required
                  />

                  <Input
                    type="password"
                    label="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    helperText="Minimum 8 characters"
                    required
                  />

                  <Input
                    type="password"
                    label="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />

                  <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
                    Reset Password
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => setStep('request')}
                    className="text-sm text-gray-500 hover:text-wiria-blue-dark"
                  >
                    ← Request new reset link
                  </button>
                </div>
              </>
            )}

            {/* Success Step */}
            {step === 'success' && (
              <div className="py-6 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                  <svg
                    className="h-10 w-10 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h1 className="mb-2 text-2xl font-bold text-green-800">Password Reset!</h1>
                <p className="mb-6 text-gray-600">
                  Your password has been successfully reset. You can now login with your new password.
                </p>
                <Link to="/member-login">
                  <Button fullWidth size="lg">
                    Login to Member Portal
                  </Button>
                </Link>
              </div>
            )}

            {/* Back to Login */}
            {step !== 'success' && (
              <div className="mt-8 border-t border-gray-100 pt-6 text-center">
                <Link
                  to="/member-login"
                  className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-wiria-blue-dark"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back to Login
                </Link>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
