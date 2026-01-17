/**
 * usePaymentFlow Hook Tests
 * Tests for the shared payment processing hook used by donations, registrations, and renewals
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { usePaymentFlow } from '@/shared/hooks/usePaymentFlow';
import { apiClient } from '@/shared/services/api/client';
import { notificationService } from '@/shared/services/notification/notificationService';
import { PaymentStatus } from '@/shared/types/payment';

// Mock dependencies
vi.mock('@/shared/services/api/client');
vi.mock('@/shared/services/notification/notificationService');

describe('usePaymentFlow', () => {
  const defaultConfig = {
    flowType: 'donation' as const,
    initiationEndpoint: '/api/donations',
    statusEndpoint: '/api/donations/status',
    manualVerificationEndpoint: '/api/donations/verify',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initiatePayment', () => {
    it('should successfully initiate STK Push payment', async () => {
      const mockResponse = {
        data: {
          checkoutRequestId: 'req-123',
          transactionId: 'txn-456',
          status: PaymentStatus.PENDING,
          message: 'STK push sent successfully',
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => usePaymentFlow(defaultConfig));

      const paymentData = {
        amount: 1000,
        phone: '+254712345678',
        paymentMethod: 'STK_PUSH' as const,
      };

      let response;
      await act(async () => {
        response = await result.current.initiatePayment(paymentData);
      });

      expect(apiClient.post).toHaveBeenCalledWith('/api/donations', paymentData);
      expect(response).toEqual({
        success: true,
        checkoutRequestId: 'req-123',
        transactionId: 'txn-456',
        message: 'STK push sent successfully',
      });
      expect(result.current.paymentStatus).toBe(PaymentStatus.PENDING);
      expect(result.current.checkoutRequestId).toBe('req-123');
      expect(result.current.transactionId).toBe('txn-456');
      expect(notificationService.success).toHaveBeenCalledWith('STK push sent successfully');
    });

    it('should successfully initiate manual payment', async () => {
      const mockResponse = {
        data: {
          transactionId: 'manual-789',
          status: PaymentStatus.PENDING,
          message: 'Manual payment submitted for verification',
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => usePaymentFlow(defaultConfig));

      const paymentData = {
        amount: 2000,
        paymentMethod: 'MANUAL' as const,
        mpesaCode: 'ABC123XYZ',
      };

      let response;
      await act(async () => {
        response = await result.current.initiatePayment(paymentData);
      });

      expect(response).toEqual({
        success: true,
        transactionId: 'manual-789',
        message: 'Manual payment submitted for verification',
      });
      expect(result.current.paymentStatus).toBe(PaymentStatus.PENDING);
      expect(notificationService.success).toHaveBeenCalledWith('Manual payment submitted for verification');
    });

    it('should handle payment initiation failure', async () => {
      const mockError = {
        response: {
          data: {
            message: 'Payment initiation failed',
          },
        },
      };

      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      const { result } = renderHook(() => usePaymentFlow(defaultConfig));

      const paymentData = {
        amount: 1000,
        phone: '+254712345678',
        paymentMethod: 'STK_PUSH' as const,
      };

      let response;
      await act(async () => {
        response = await result.current.initiatePayment(paymentData);
      });

      expect(response).toEqual({
        success: false,
        message: 'Payment initiation failed',
      });
      expect(notificationService.error).toHaveBeenCalledWith('Payment initiation failed');
      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe('checkPaymentStatus', () => {
    it('should successfully check payment status - COMPLETED', async () => {
      const mockResponse = {
        data: {
          status: PaymentStatus.COMPLETED,
          transactionId: 'txn-123',
          message: 'Payment completed successfully',
        },
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => usePaymentFlow(defaultConfig));

      let response;
      await act(async () => {
        response = await result.current.checkPaymentStatus('don-123');
      });

      expect(apiClient.get).toHaveBeenCalledWith('/api/donations/status/don-123');
      expect(response).toEqual({
        status: PaymentStatus.COMPLETED,
        transactionId: 'txn-123',
        message: 'Payment completed successfully',
      });
      expect(result.current.paymentStatus).toBe(PaymentStatus.COMPLETED);
      expect(notificationService.success).toHaveBeenCalledWith('Payment completed successfully');
    });

    it('should handle PENDING status without notification', async () => {
      const mockResponse = {
        data: {
          status: PaymentStatus.PENDING,
          message: 'Payment is still pending',
        },
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => usePaymentFlow(defaultConfig));

      let response;
      await act(async () => {
        response = await result.current.checkPaymentStatus('don-123');
      });

      expect(result.current.paymentStatus).toBe(PaymentStatus.PENDING);
      expect(notificationService.success).not.toHaveBeenCalled();
      expect(notificationService.error).not.toHaveBeenCalled();
    });

    it('should handle FAILED status', async () => {
      const mockResponse = {
        data: {
          status: PaymentStatus.FAILED,
          message: 'Payment failed - insufficient funds',
        },
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => usePaymentFlow(defaultConfig));

      let response;
      await act(async () => {
        response = await result.current.checkPaymentStatus('don-123');
      });

      expect(result.current.paymentStatus).toBe(PaymentStatus.FAILED);
      expect(notificationService.error).toHaveBeenCalledWith('Payment failed - insufficient funds');
    });

    it('should handle status check failure', async () => {
      const mockError = {
        response: {
          data: {
            message: 'Failed to check payment status',
          },
        },
      };

      vi.mocked(apiClient.get).mockRejectedValue(mockError);

      const { result } = renderHook(() => usePaymentFlow(defaultConfig));

      let response;
      await act(async () => {
        response = await result.current.checkPaymentStatus('don-123');
      });

      expect(response.status).toBe(PaymentStatus.FAILED);
      expect(notificationService.error).toHaveBeenCalledWith('Failed to check payment status');
    });
  });

  describe('verifyManualPayment', () => {
    it('should successfully verify manual payment', async () => {
      const mockResponse = {
        data: {
          verified: true,
          message: 'Payment verified successfully',
          status: PaymentStatus.COMPLETED,
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => usePaymentFlow(defaultConfig));

      let response;
      await act(async () => {
        response = await result.current.verifyManualPayment({
          transactionId: 'txn-123',
          mpesaCode: 'ABC123XYZ',
        });
      });

      expect(apiClient.post).toHaveBeenCalledWith('/api/donations/verify', {
        transactionId: 'txn-123',
        mpesaCode: 'ABC123XYZ',
      });
      expect(response).toEqual({
        verified: true,
        message: 'Payment verified successfully',
      });
      expect(result.current.isManualPaymentVerified).toBe(true);
      expect(result.current.paymentStatus).toBe(PaymentStatus.COMPLETED);
      expect(notificationService.success).toHaveBeenCalledWith('Payment verified successfully');
    });

    it('should handle verification failure', async () => {
      const mockResponse = {
        data: {
          verified: false,
          message: 'Invalid M-Pesa code',
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => usePaymentFlow(defaultConfig));

      let response;
      await act(async () => {
        response = await result.current.verifyManualPayment({
          transactionId: 'txn-123',
          mpesaCode: 'INVALID',
        });
      });

      expect(response.verified).toBe(false);
      expect(result.current.isManualPaymentVerified).toBe(false);
      expect(notificationService.error).toHaveBeenCalledWith('Invalid M-Pesa code');
    });

    it('should throw error when manual verification endpoint not configured', async () => {
      const configWithoutManual = {
        ...defaultConfig,
        manualVerificationEndpoint: undefined,
      };

      const { result } = renderHook(() => usePaymentFlow(configWithoutManual));

      await expect(async () => {
        await act(async () => {
          await result.current.verifyManualPayment({
            transactionId: 'txn-123',
            mpesaCode: 'ABC123',
          });
        });
      }).rejects.toThrow('Manual verification endpoint not configured');
    });
  });

  describe('resetPaymentState', () => {
    it('should reset all payment state', async () => {
      const mockResponse = {
        data: {
          checkoutRequestId: 'req-123',
          status: PaymentStatus.PENDING,
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => usePaymentFlow(defaultConfig));

      // First initiate a payment to set some state
      await act(async () => {
        await result.current.initiatePayment({
          amount: 1000,
          paymentMethod: 'STK_PUSH' as const,
        });
      });

      expect(result.current.paymentStatus).toBe(PaymentStatus.PENDING);
      expect(result.current.checkoutRequestId).toBe('req-123');

      // Reset state
      act(() => {
        result.current.resetPaymentState();
      });

      expect(result.current.paymentStatus).toBeNull();
      expect(result.current.checkoutRequestId).toBeNull();
      expect(result.current.transactionId).toBeNull();
      expect(result.current.isManualPaymentVerified).toBe(false);
    });
  });

  describe('custom messages', () => {
    it('should use custom success messages when provided', async () => {
      const customConfig = {
        ...defaultConfig,
        messages: {
          initiationSuccess: 'Custom STK push sent!',
          paymentCompleted: 'Custom payment completed!',
        },
      };

      const mockResponse = {
        data: {
          checkoutRequestId: 'req-123',
          status: PaymentStatus.PENDING,
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => usePaymentFlow(customConfig));

      await act(async () => {
        await result.current.initiatePayment({
          amount: 1000,
          paymentMethod: 'STK_PUSH' as const,
        });
      });

      expect(notificationService.success).toHaveBeenCalledWith('Custom STK push sent!');
    });
  });

  describe('state management', () => {
    it('should properly manage isSubmitting state', async () => {
      const mockResponse = {
        data: {
          status: PaymentStatus.PENDING,
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => usePaymentFlow(defaultConfig));

      expect(result.current.isSubmitting).toBe(false);

      const promise = act(async () => {
        await result.current.initiatePayment({
          amount: 1000,
          paymentMethod: 'STK_PUSH' as const,
        });
      });

      // State should be true during submission
      await promise;

      // State should be false after completion
      expect(result.current.isSubmitting).toBe(false);
    });

    it('should properly manage isVerifying state', async () => {
      const mockResponse = {
        data: {
          status: PaymentStatus.PENDING,
        },
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => usePaymentFlow(defaultConfig));

      expect(result.current.isVerifying).toBe(false);

      await act(async () => {
        await result.current.checkPaymentStatus('txn-123');
      });

      expect(result.current.isVerifying).toBe(false);
    });
  });
});
