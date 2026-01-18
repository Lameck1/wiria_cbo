/**
 * usePaymentFlow Hook Tests
 * Tests for the shared payment processing hook used by donations, registrations, and renewals
 */

import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { usePaymentFlow } from '@/shared/hooks/usePaymentFlow';
import { ServiceProvider, createMockServiceContainer } from '@/shared/services/di';
import { PaymentStatus } from '@/shared/types/payment';

let services: ReturnType<typeof createMockServiceContainer>;

const wrapper = ({ children }: any) => (
  <ServiceProvider services={services}>{children}</ServiceProvider>
);

describe('usePaymentFlow', () => {
  const defaultConfig = {
    flowType: 'donation' as const,
    initiationEndpoint: '/api/donations',
    statusEndpoint: '/api/donations/status',
    manualVerificationEndpoint: '/api/donations/verify',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    services = createMockServiceContainer({
      apiClient: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
        setTokenResolver: vi.fn(),
        setUnauthorizedCallback: vi.fn(),
      },
      notificationService: {
        success: vi.fn(),
        error: vi.fn(),
        warning: vi.fn(),
        info: vi.fn(),
        clearAll: vi.fn(),
      },
      logger: {
        error: vi.fn(),
        warn: vi.fn(),
        debug: vi.fn(),
      },
      storageService: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
    });
  });

  describe('initiatePayment', () => {
    it('should successfully initiate STK Push payment', async () => {
      const mockResponse = {
        checkoutRequestId: 'req-123',
        status: PaymentStatus.PENDING,
        message: 'STK push sent successfully',
      };

      vi.mocked(services.apiClient.post).mockResolvedValue(mockResponse as never);

      const { result } = renderHook(() => usePaymentFlow(defaultConfig), {
        wrapper,
      });

      const paymentData = {
        amount: 1000,
        phone: '+254712345678',
        paymentMethod: 'STK_PUSH' as const,
      };

      let response: unknown;
      await act(async () => {
        response = await result.current.initiatePayment(paymentData);
      });

      expect(services.apiClient.post).toHaveBeenCalledWith('/api/donations', paymentData);
      expect(response).toEqual({
        success: true,
        checkoutRequestId: 'req-123',
        transactionId: 'req-123',
        message: 'STK push sent successfully',
      });
      expect(result.current.paymentStatus).toBe(PaymentStatus.PENDING);
      expect(result.current.checkoutRequestId).toBe('req-123');
      expect(result.current.transactionId).toBe('req-123');
      expect(services.notificationService.success).toHaveBeenCalledWith('STK push sent successfully');
    });

    it('should successfully initiate manual payment', async () => {
      const mockResponse = {
        transactionId: 'manual-789',
        status: PaymentStatus.PENDING,
        message: 'Manual payment submitted for verification',
      };

      vi.mocked(services.apiClient.post).mockResolvedValue(mockResponse as never);

      const { result } = renderHook(() => usePaymentFlow(defaultConfig), {
        wrapper,
      });

      const paymentData = {
        amount: 2000,
        paymentMethod: 'MANUAL' as const,
        mpesaCode: 'ABC123XYZ',
      };

      let response: unknown;
      await act(async () => {
        response = await result.current.initiatePayment(paymentData);
      });

      expect(response).toEqual({
        success: true,
        checkoutRequestId: 'manual-789',
        transactionId: 'manual-789',
        message: 'Manual payment submitted for verification',
      });
      expect(result.current.paymentStatus).toBe(PaymentStatus.PENDING);
      expect(services.notificationService.success).toHaveBeenCalledWith('Payment submitted for verification.');
    });

    it('should handle payment initiation failure', async () => {
      const mockError = new Error('Payment initiation failed');

      vi.mocked(services.apiClient.post).mockRejectedValue(mockError);

      const { result } = renderHook(() => usePaymentFlow(defaultConfig), {
        wrapper,
      });

      const paymentData = {
        amount: 1000,
        phone: '+254712345678',
        paymentMethod: 'STK_PUSH' as const,
      };

      let response: unknown;
      await act(async () => {
        response = await result.current.initiatePayment(paymentData);
      });

      expect(response).toEqual({
        success: false,
      });
      expect(services.notificationService.error).toHaveBeenCalledWith(
        'Payment initiation failed. Please try again.'
      );
      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe('checkPaymentStatus', () => {
    it('should successfully check payment status - COMPLETED', async () => {
      const mockResponse = {
        status: PaymentStatus.COMPLETED,
        transactionId: 'txn-123',
        message: 'Payment completed successfully',
      };

      vi.mocked(services.apiClient.get).mockResolvedValue(mockResponse as never);

      const { result } = renderHook(() => usePaymentFlow(defaultConfig), {
        wrapper,
      });

      let response: PaymentStatus = PaymentStatus.PENDING;
      await act(async () => {
        response = await result.current.checkPaymentStatus('don-123');
      });

      expect(services.apiClient.get).toHaveBeenCalledWith('/api/donations/status/don-123');
      expect(response).toBe(PaymentStatus.COMPLETED);
      expect(result.current.paymentStatus).toBe(PaymentStatus.COMPLETED);
      expect(services.notificationService.success).toHaveBeenCalledWith('Payment completed successfully!');
    });

    it('should handle PENDING status without notification', async () => {
      const mockResponse = {
        status: PaymentStatus.PENDING,
        message: 'Payment is still pending',
      };

      vi.mocked(services.apiClient.get).mockResolvedValue(mockResponse as never);

      const { result } = renderHook(() => usePaymentFlow(defaultConfig), {
        wrapper,
      });

      await act(async () => {
        await result.current.checkPaymentStatus('don-123');
      });

      expect(result.current.paymentStatus).toBe(PaymentStatus.PENDING);
      expect(services.notificationService.success).not.toHaveBeenCalled();
      expect(services.notificationService.error).not.toHaveBeenCalled();
    });

    it('should handle FAILED status', async () => {
      const mockResponse = {
        status: PaymentStatus.FAILED,
        message: 'Payment failed - insufficient funds',
      };

      vi.mocked(services.apiClient.get).mockResolvedValue(mockResponse as never);

      const { result } = renderHook(() => usePaymentFlow(defaultConfig), {
        wrapper,
      });

      await act(async () => {
        await result.current.checkPaymentStatus('don-123');
      });

      expect(result.current.paymentStatus).toBe(PaymentStatus.FAILED);
      expect(services.notificationService.error).toHaveBeenCalledWith('Payment failed. Please try again.');
    });

    it('should handle status check failure', async () => {
      const mockError = new Error('Failed to check payment status');

      vi.mocked(services.apiClient.get).mockRejectedValue(mockError);

      const { result } = renderHook(() => usePaymentFlow(defaultConfig), {
        wrapper,
      });

      let response: PaymentStatus = PaymentStatus.PENDING;
      await act(async () => {
        response = await result.current.checkPaymentStatus('don-123');
      });

      expect(response).toBe(PaymentStatus.PENDING);
      expect(result.current.paymentStatus).toBeNull();
      expect(services.notificationService.error).not.toHaveBeenCalled();
    });
  });

  describe('verifyManualPayment', () => {
    it('should successfully verify manual payment', async () => {
      const mockResponse = {
        verified: true,
        message: 'Payment verified successfully',
        status: PaymentStatus.COMPLETED,
      };

      vi.mocked(services.apiClient.post).mockResolvedValue(mockResponse as never);

      const { result } = renderHook(() => usePaymentFlow(defaultConfig), {
        wrapper,
      });

      let response: unknown;
      await act(async () => {
        response = await result.current.verifyManualPayment('+254712345678', 1000, 'DONATION');
      });

      expect(services.apiClient.post).toHaveBeenCalledWith('/api/donations/verify', {
        phone: '+254712345678',
        amount: 1000,
        accountReference: 'DONATION',
      });
      expect(response).toEqual({
        success: true,
        verified: true,
      });
      expect(result.current.isManualPaymentVerified).toBe(true);
      expect(result.current.paymentStatus).toBe(PaymentStatus.COMPLETED);
      expect(services.notificationService.success).toHaveBeenCalledWith('Payment verified successfully!');
    });

    it('should handle verification failure', async () => {
      const mockResponse = {
        verified: false,
        message: 'Invalid M-Pesa code',
      };

      vi.mocked(services.apiClient.post).mockResolvedValue(mockResponse as never);

      const { result } = renderHook(() => usePaymentFlow(defaultConfig), {
        wrapper,
      });

      let response: unknown;
      await act(async () => {
        response = await result.current.verifyManualPayment('+254712345678', 1000, 'DONATION');
      });

      expect(response).toEqual({
        success: false,
        verified: false,
      });
      expect(result.current.isManualPaymentVerified).toBe(false);
      expect(services.notificationService.error).toHaveBeenCalledWith(
        'Payment not found yet. Please wait a moment and try again.'
      );
    });

    it('should throw error when manual verification endpoint not configured', async () => {
      const configWithoutManual = {
        ...defaultConfig,
        manualVerificationEndpoint: undefined,
      };

      const { result } = renderHook(() => usePaymentFlow(configWithoutManual), {
        wrapper,
      });

      await act(async () => {
        const response = await result.current.verifyManualPayment('+254712345678', 1000);
        expect(response).toEqual({ success: false });
      });

      expect(services.notificationService.error).toHaveBeenCalledWith('Manual payment verification not configured.');
    });
  });

  describe('resetPayment', () => {
    it('should reset all payment state', async () => {
      const mockResponse = {
        checkoutRequestId: 'req-123',
        status: PaymentStatus.PENDING,
      };

      vi.mocked(services.apiClient.post).mockResolvedValue(mockResponse as never);

      const { result } = renderHook(() => usePaymentFlow(defaultConfig), {
        wrapper,
      });

      // First initiate a payment to set some state
      await act(async () => {
        await result.current.initiatePayment({
          amount: 1000,
          phone: '+254712345678',
          paymentMethod: 'STK_PUSH' as const,
        });
      });

      expect(result.current.paymentStatus).toBe(PaymentStatus.PENDING);
      expect(result.current.checkoutRequestId).toBe('req-123');

      // Reset state
      act(() => {
        result.current.resetPayment();
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
        checkoutRequestId: 'req-123',
        status: PaymentStatus.PENDING,
      };

      vi.mocked(services.apiClient.post).mockResolvedValue(mockResponse as never);

      const { result } = renderHook(() => usePaymentFlow(customConfig), {
        wrapper,
      });

      await act(async () => {
        await result.current.initiatePayment({
          amount: 1000,
          paymentMethod: 'STK_PUSH' as const,
        });
      });

      expect(services.notificationService.success).toHaveBeenCalledWith('Custom STK push sent!');
    });
  });

  describe('state management', () => {
    it('should properly manage isSubmitting state', async () => {
      const mockResponse = {
        status: PaymentStatus.PENDING,
      };

      vi.mocked(services.apiClient.post).mockResolvedValue(mockResponse as never);

      const { result } = renderHook(() => usePaymentFlow(defaultConfig), {
        wrapper,
      });

      expect(result.current.isSubmitting).toBe(false);

      await act(async () => {
        await result.current.initiatePayment({
          amount: 1000,
          paymentMethod: 'STK_PUSH' as const,
        });
      });
      expect(result.current.isSubmitting).toBe(false);
    });

    it('should properly manage isVerifying state', async () => {
      const mockResponse = {
        verified: false,
      };

      vi.mocked(services.apiClient.post).mockResolvedValue(mockResponse as never);

      const { result } = renderHook(() => usePaymentFlow(defaultConfig), {
        wrapper,
      });

      expect(result.current.isVerifying).toBe(false);

      await act(async () => {
        await result.current.verifyManualPayment('+254712345678', 1000);
      });

      expect(result.current.isVerifying).toBe(false);
    });
  });
});
