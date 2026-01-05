/**
 * useDonation Hook Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDonation } from '@/features/donations/hooks/useDonation';
import { apiClient } from '@/shared/services/api/client';
import { notificationService } from '@/shared/services/notification/notificationService';

// Mock dependencies
vi.mock('@/shared/services/api/client');
vi.mock('@/shared/services/notification/notificationService');

describe('useDonation', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('initiateDonation', () => {
        it('should successfully initiate STK Push donation', async () => {
            const mockResponse = {
                data: {
                    donation: {
                        id: 'don-123',
                        amount: 1000,
                        status: 'PENDING',
                    },
                    checkoutRequestId: 'req-456',
                    message: 'STK push sent',
                },
            };

            vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

            const { result } = renderHook(() => useDonation());

            const donationData = {
                amount: 1000,
                donorName: 'Test Donor',
                donorEmail: 'test@example.com',
                donorPhone: '+254712345678',
                purpose: 'health',
                isAnonymous: false,
                paymentMethod: 'STK_PUSH' as const,
            };

            let response;
            await act(async () => {
                response = await result.current.initiateDonation(donationData);
            });

            expect(apiClient.post).toHaveBeenCalledWith('/donations/initiate', donationData);
            expect(result.current.donationId).toBe('don-123');
            expect(result.current.checkoutRequestId).toBe('req-456');
            expect(result.current.paymentStatus).toBe('PENDING');
            expect(notificationService.info).toHaveBeenCalledWith(
                expect.stringContaining('STK push sent')
            );
            expect(response).toEqual({
                success: true,
                donationId: 'don-123',
                checkoutRequestId: 'req-456',
            });
        });

        it('should successfully initiate Manual donation', async () => {
            const mockResponse = {
                data: {
                    donation: {
                        id: 'don-124',
                        amount: 2000,
                        status: 'PENDING',
                    },
                    message: 'Donation initiated',
                },
            };

            vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

            const { result } = renderHook(() => useDonation());

            const donationData = {
                amount: 2000,
                donorName: 'Manual Donor',
                donorEmail: 'manual@example.com',
                donorPhone: '+254712345678',
                purpose: '',
                isAnonymous: false,
                paymentMethod: 'MANUAL' as const,
            };

            await act(async () => {
                await result.current.initiateDonation(donationData);
            });

            expect(result.current.donationId).toBe('don-124');
            expect(result.current.checkoutRequestId).toBeNull();
            expect(notificationService.success).toHaveBeenCalled();
        });

        it('should handle donation initiation failure', async () => {
            vi.mocked(apiClient.post).mockRejectedValue(new Error('Network error'));

            const { result } = renderHook(() => useDonation());

            const donationData = {
                amount: 1000,
                donorName: 'Test',
                donorEmail: 'test@example.com',
                donorPhone: '+254712345678',
                purpose: '',
                isAnonymous: false,
                paymentMethod: 'STK_PUSH' as const,
            };

            let response;
            await act(async () => {
                response = await result.current.initiateDonation(donationData);
            });

            expect(notificationService.error).toHaveBeenCalledWith(
                'Failed to initiate donation. Please try again.'
            );
            expect(response).toEqual({ success: false });
        });
    });

    describe('checkPaymentStatus', () => {
        it('should return COMPLETED status', async () => {
            const mockResponse = {
                data: {
                    status: 'COMPLETED',
                },
            };

            vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

            const { result } = renderHook(() => useDonation());

            let status;
            await act(async () => {
                status = await result.current.checkPaymentStatus('don-123');
            });

            expect(result.current.paymentStatus).toBe('COMPLETED');
            expect(notificationService.success).toHaveBeenCalledWith(
                expect.stringContaining('Payment completed')
            );
            expect(status).toBe('COMPLETED');
        });

        it('should return FAILED status', async () => {
            const mockResponse = {
                data: {
                    status: 'FAILED',
                },
            };

            vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

            const { result } = renderHook(() => useDonation());

            let status;
            await act(async () => {
                status = await result.current.checkPaymentStatus('don-123');
            });

            expect(result.current.paymentStatus).toBe('FAILED');
            expect(notificationService.error).toHaveBeenCalledWith(
                expect.stringContaining('Payment failed')
            );
            expect(status).toBe('FAILED');
        });

        it('should return PENDING on error', async () => {
            vi.mocked(apiClient.get).mockRejectedValue(new Error('Network error'));

            const { result } = renderHook(() => useDonation());

            let status;
            await act(async () => {
                status = await result.current.checkPaymentStatus('don-123');
            });

            expect(status).toBe('PENDING');
        });
    });

    describe('resetDonation', () => {
        it('should reset all donation state', async () => {
            const mockResponse = {
                data: {
                    donation: { id: 'don-123', amount: 1000, status: 'PENDING' },
                    checkoutRequestId: 'req-456',
                    message: 'Success',
                },
            };

            vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

            const { result } = renderHook(() => useDonation());

            // First initiate a donation
            await act(async () => {
                await result.current.initiateDonation({
                    amount: 1000,
                    donorName: 'Test',
                    donorEmail: 'test@example.com',
                    donorPhone: '+254712345678',
                    purpose: '',
                    isAnonymous: false,
                    paymentMethod: 'STK_PUSH',
                });
            });

            expect(result.current.donationId).toBe('don-123');

            // Then reset
            act(() => {
                result.current.resetDonation();
            });

            expect(result.current.donationId).toBeNull();
            expect(result.current.checkoutRequestId).toBeNull();
            expect(result.current.paymentStatus).toBeNull();
            expect(result.current.isSubmitting).toBe(false);
        });
    });
});
