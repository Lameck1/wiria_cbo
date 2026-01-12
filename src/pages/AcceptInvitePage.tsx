/**
 * Accept Invitation Page
 */

import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/shared/components/layout/Layout';
import { Button } from '@/shared/components/ui/Button';
import {
  verifyInvitation,
  acceptInvitation,
  VerifyInviteResponse,
} from '@/features/auth/api/auth.api';
import { notificationService } from '@/shared/services/notification/notificationService';
import { ApiError } from '@/shared/services/api/client';

export default function AcceptInvitePage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [inviteData, setInviteData] = useState<VerifyInviteResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Missing invitation token.');
      setIsLoading(false);
      return;
    }

    const verify = async () => {
      try {
        const response = await verifyInvitation(token);
        setInviteData(response);
      } catch (err: unknown) {
        const message =
          err instanceof ApiError ? err.message : 'The invitation link is invalid or has expired.';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    verify();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      notificationService.error('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      notificationService.error('Password must be at least 8 characters long');
      return;
    }

    setIsSubmitting(true);
    try {
      if (!token) {
        notificationService.error('Missing invitation token');
        return;
      }
      await acceptInvitation(token, password);
      notificationService.success('Invitation accepted! You can now log in.');
      navigate('/staff-login', { replace: true });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to accept invitation';
      notificationService.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="flex min-h-[80vh] items-center justify-center bg-gray-50/50 px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50">
            {/* Header */}
            <div className="from-primary-600 to-primary-700 bg-gradient-to-r p-8 text-center">
              <h1 className="mb-2 text-2xl font-bold text-white">Join the WIRIA Team</h1>
              <p className="text-primary-100 text-sm opacity-90">
                Please set up your account password to continue.
              </p>
            </div>

            <div className="p-8">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12"
                  >
                    <div className="border-primary-200 border-t-primary-600 mb-4 h-12 w-12 animate-spin rounded-full border-4" />
                    <p className="font-medium text-gray-500">Verifying invitation...</p>
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-8 text-center"
                  >
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
                      <svg
                        className="h-8 w-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                    <h2 className="mb-2 text-xl font-bold text-gray-900">Link Invalid</h2>
                    <p className="mb-8 text-gray-500">{error}</p>
                    <Link to="/">
                      <Button variant="secondary" fullWidth>
                        Return to Home
                      </Button>
                    </Link>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    {/* Invitation Details Summary */}
                    <div className="mb-6 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary-100 text-primary-600 flex h-10 w-10 items-center justify-center rounded-full font-bold">
                          {(
                            inviteData?.firstName?.[0] ||
                            inviteData?.email?.[0] ||
                            'U'
                          ).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {inviteData?.firstName} {inviteData?.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{inviteData?.email}</p>
                        </div>
                      </div>
                      <div className="text-primary-600 bg-primary-50 mt-2 inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                        Role: {inviteData?.role}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="mb-1.5 block text-sm font-bold text-gray-700">
                          New Password
                        </label>
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="focus:ring-primary-500/20 focus:border-primary-500 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:ring-2"
                          placeholder="Minimum 8 characters"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-bold text-gray-700">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="focus:ring-primary-500/20 focus:border-primary-500 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:ring-2"
                          placeholder="Re-enter password"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      fullWidth
                      disabled={isSubmitting}
                      className="shadow-primary-500/25 h-12 text-base shadow-lg"
                    >
                      {isSubmitting ? 'Setting up Account...' : 'Complete Invitation'}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-500">
            Need help? Contact{' '}
            <a href="mailto:admin@wiria.org" className="text-primary-600 font-bold hover:underline">
              Support
            </a>
          </p>
        </motion.div>
      </div>
    </Layout>
  );
}
