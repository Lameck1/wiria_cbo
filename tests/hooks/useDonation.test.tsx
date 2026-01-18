/**
 * useDonation Hook Tests
 */

import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useDonation } from '@/features/donations/hooks/useDonation';
import { apiClientAdapter } from '@/shared/services/adapters';
import { useServices } from '@/shared/services/di';
import { notificationService } from '@/shared/services/notification/notificationService';

// Mock service adapter and notification service used by DI container
vi.mock('@/shared/services/adapters', () => ({
  apiClientAdapter: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    setTokenResolver: vi.fn(),
    setUnauthorizedCallback: vi.fn(),
  },
  loggerAdapter: {
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
  notificationServiceAdapter: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    clearAll: vi.fn(),
  },
  storageServiceAdapter: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
}));

vi.mock('@/shared/services/notification/notificationService');
vi.mock('@/shared/services/di', async () => {
  const actual: any = await vi.importActual('@/shared/services/di');

  return {
    ...actual,
    useServices: vi.fn(),
  };
});

describe('useDonation', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useServices).mockReturnValue({
      apiClient: apiClientAdapter,
      notificationService,
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
    } as never);
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

      vi.mocked(apiClientAdapter.post).mockResolvedValue(mockResponse as never);

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

      expect(apiClientAdapter.post).toHaveBeenCalledWith('/donations/initiate', donationData);
      expect(result.current.donationId).toBe('don-123');
      expect(result.current.checkoutRequestId).toBe('req-456');
      expect(result.current.paymentStatus).toBe('PENDING');
      expect(notificationService.success).toHaveBeenCalledWith(
        expect.stringContaining('STK push sent')
      );
      expect(response).toEqual(
        expect.objectContaining({
          success: true,
          donationId: 'don-123',
          checkoutRequestId: 'req-456',
        })
      );
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

      vi.mocked(apiClientAdapter.post).mockResolvedValue(mockResponse as never);

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
      vi.mocked(apiClientAdapter.post).mockRejectedValue(new Error('Network error'));

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

      vi.mocked(apiClientAdapter.get).mockResolvedValue(mockResponse as never);

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

      vi.mocked(apiClientAdapter.get).mockResolvedValue(mockResponse as never);

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
      vi.mocked(apiClientAdapter.get).mockRejectedValue(new Error('Network error'));

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

      vi.mocked(apiClientAdapter.post).mockResolvedValue(mockResponse as never);

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
