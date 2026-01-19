/**
 * Reset Password Page
 * Password reset request and confirmation
 */

import { useState } from 'react';

import { ResetPasswordBackToLogin } from '@/features/auth/components/reset-password/BackToLogin';
import { ResetPasswordConfirmStep } from '@/features/auth/components/reset-password/ConfirmStep';
import { ResetPasswordRequestStep } from '@/features/auth/components/reset-password/RequestStep';
import { ResetPasswordSuccessStep } from '@/features/auth/components/reset-password/SuccessStep';
import { Card, CardBody } from '@/shared/components/ui/Card';
import { apiClient } from '@/shared/services/api/client';
import { API_ENDPOINTS } from '@/shared/services/api/endpoints';
import { logger } from '@/shared/services/logger';
import { notificationService } from '@/shared/services/notification/notificationService';

type Step = 'request' | 'confirm' | 'success';

function ResetPasswordPage() {
  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestReset = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await apiClient.post(API_ENDPOINTS.AUTH_RESET_PASSWORD_REQUEST, { email });
      notificationService.success('Password reset link sent to your email!');
      setStep('confirm');
    } catch (error) {
      notificationService.error(
        'Failed to send reset link. Please check your email and try again.'
      );
      logger.error('Reset request error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmReset = async (event: React.FormEvent) => {
    event.preventDefault();

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
      logger.error('Reset confirm error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <Card>
          <CardBody className="p-8">
            {step === 'request' && (
              <ResetPasswordRequestStep
                email={email}
                isLoading={isLoading}
                onEmailChange={setEmail}
                onSubmit={(event) => {
                  void handleRequestReset(event);
                }}
                onGoToConfirm={() => setStep('confirm')}
              />
            )}

            {step === 'confirm' && (
              <ResetPasswordConfirmStep
                token={token}
                newPassword={newPassword}
                confirmPassword={confirmPassword}
                isLoading={isLoading}
                onTokenChange={setToken}
                onNewPasswordChange={setNewPassword}
                onConfirmPasswordChange={setConfirmPassword}
                onSubmit={(event) => {
                  void handleConfirmReset(event);
                }}
                onBackToRequest={() => setStep('request')}
              />
            )}

            {step === 'success' && <ResetPasswordSuccessStep />}

            <ResetPasswordBackToLogin hidden={step === 'success'} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
