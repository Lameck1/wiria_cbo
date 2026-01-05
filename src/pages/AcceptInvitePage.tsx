/**
 * Accept Invitation Page
 */

import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/shared/components/layout/Layout';
import { Button } from '@/shared/components/ui/Button';
import { verifyInvitation, acceptInvitation, VerifyInviteResponse } from '@/features/auth/api/auth.api';
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
                const message = err instanceof ApiError ? err.message : 'The invitation link is invalid or has expired.';
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
            <div className="min-h-[80vh] flex items-center justify-center py-20 px-4 bg-gray-50/50">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full"
                >
                    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-8 text-center">
                            <h1 className="text-2xl font-bold text-white mb-2">Join the WIRIA Team</h1>
                            <p className="text-primary-100 text-sm opacity-90">Please set up your account password to continue.</p>
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
                                        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4" />
                                        <p className="text-gray-500 font-medium">Verifying invitation...</p>
                                    </motion.div>
                                ) : error ? (
                                    <motion.div
                                        key="error"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-8"
                                    >
                                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-2">Link Invalid</h2>
                                        <p className="text-gray-500 mb-8">{error}</p>
                                        <Link to="/">
                                            <Button variant="secondary" fullWidth>Return to Home</Button>
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
                                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold">
                                                    {(inviteData?.firstName?.[0] || inviteData?.email?.[0] || 'U').toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">
                                                        {inviteData?.firstName} {inviteData?.lastName}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{inviteData?.email}</p>
                                                </div>
                                            </div>
                                            <div className="mt-2 text-[10px] font-bold uppercase tracking-wider text-primary-600 bg-primary-50 inline-block px-2 py-0.5 rounded">
                                                Role: {inviteData?.role}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1.5">New Password</label>
                                                <input
                                                    type="password"
                                                    required
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-gray-400"
                                                    placeholder="Minimum 8 characters"
                                                    disabled={isSubmitting}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1.5">Confirm Password</label>
                                                <input
                                                    type="password"
                                                    required
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-gray-400"
                                                    placeholder="Re-enter password"
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            fullWidth
                                            disabled={isSubmitting}
                                            className="h-12 text-base shadow-lg shadow-primary-500/25"
                                        >
                                            {isSubmitting ? 'Setting up Account...' : 'Complete Invitation'}
                                        </Button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <p className="text-center mt-8 text-sm text-gray-500">
                        Need help? Contact <a href="mailto:admin@wiria.org" className="text-primary-600 font-bold hover:underline">Support</a>
                    </p>
                </motion.div>
            </div>
        </Layout>
    );
}
