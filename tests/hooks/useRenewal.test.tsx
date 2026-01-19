import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useRenewal } from '@/features/membership/hooks/useRenewal';
import { apiClientAdapter } from '@/shared/services/adapters';
import { useServices } from '@/shared/services/di';
import { notificationService } from '@/shared/services/notification/notificationService';

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

describe('useRenewal', () => {
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

  describe('submitRenewal', () => {
    it('successfully submits STK Push renewal and updates state', async () => {
      const mockResponse = {
        checkoutRequestId: 'renew-req-123',
        message: 'Renewal STK push sent',
      };

      vi.mocked(apiClientAdapter.post).mockResolvedValue(mockResponse as never);

      const { result } = renderHook(() => useRenewal());

      const renewalData = {
        paymentMethod: 'STK_PUSH' as const,
        phoneNumber: '+254712345678',
        amount: 1500,
      };

      let response;
      await act(async () => {
        response = await result.current.submitRenewal(renewalData);
      });

      expect(apiClientAdapter.post).toHaveBeenCalledWith('/members/renew', renewalData);
      expect(result.current.renewalId).toBe('renew-req-123');
      expect(result.current.paymentStatus).toBe('PENDING');
      expect(response).toEqual(
        expect.objectContaining({
          success: true,
          transactionId: 'renew-req-123',
          message: 'Renewal STK push sent',
        })
      );
    });

    it('successfully submits manual renewal and keeps state consistent', async () => {
      const mockResponse = {
        transactionId: 'renew-tx-456',
        message: 'Renewal submitted for verification',
      };

      vi.mocked(apiClientAdapter.post).mockResolvedValue(mockResponse as never);

      const { result } = renderHook(() => useRenewal());

      const renewalData = {
        paymentMethod: 'MANUAL' as const,
        transactionCode: 'ABC123',
        amount: 2000,
      };

      await act(async () => {
        await result.current.submitRenewal(renewalData);
      });

      expect(apiClientAdapter.post).toHaveBeenCalledWith('/members/renew', renewalData);
      expect(result.current.renewalId).toBe('renew-tx-456');
      expect(result.current.paymentStatus).toBe('PENDING');
      expect(notificationService.success).toHaveBeenCalled();
    });

    it('handles renewal submission failure', async () => {
      vi.mocked(apiClientAdapter.post).mockRejectedValue(new Error('Network error') as never);

      const { result } = renderHook(() => useRenewal());

      const renewalData = {
        paymentMethod: 'STK_PUSH' as const,
        phoneNumber: '+254712345678',
        amount: 1500,
      };

      let response;
      await act(async () => {
        response = await result.current.submitRenewal(renewalData);
      });

      expect(response).toEqual({ success: false });
      expect(result.current.renewalId).toBeNull();
    });
  });

  describe('resetRenewal', () => {
    it('resets renewal state and delegates to payment flow reset', async () => {
      const mockResponse = {
        checkoutRequestId: 'renew-req-123',
        message: 'Renewal initiated',
      };

      vi.mocked(apiClientAdapter.post).mockResolvedValue(mockResponse as never);

      const { result } = renderHook(() => useRenewal());

      await act(async () => {
        await result.current.submitRenewal({
          paymentMethod: 'STK_PUSH',
          phoneNumber: '+254712345678',
          amount: 1500,
        });
      });

      expect(result.current.renewalId).toBe('renew-req-123');

      act(() => {
        result.current.resetRenewal();
      });

      expect(result.current.renewalId).toBeNull();
      expect(result.current.paymentStatus).toBeNull();
      expect(result.current.transactionId).toBeNull();
      expect(result.current.isSubmitting).toBe(false);
    });
  });
});
