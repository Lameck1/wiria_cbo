/**
 * useRegistration Hook Tests
 */

import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useRegistration } from '@/features/membership/hooks/useRegistration';
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

describe('useRegistration', () => {
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

  describe('submitRegistration', () => {
    it('should successfully register with STK Push', async () => {
      const mockResponse = {
        data: {
          member: {
            id: 'mem-123',
            membershipNumber: 'WIRIA-2024-001',
            status: 'PENDING',
          },
          checkoutRequestId: 'req-789',
          message: 'Registration successful',
        },
      };

      vi.mocked(apiClientAdapter.post).mockResolvedValue(mockResponse as never);

      const { result } = renderHook(() => useRegistration());

      const registrationData = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        gender: 'MALE' as const,
        nationalId: '12345678',
        email: 'john@example.com',
        phoneNumber: '+254712345678',
        county: 'Homa Bay',
        subCounty: 'Ndhiwa',
        ward: 'West Kanyamkago',
        village: 'Test Village',
        membershipFee: 500,
        paymentMethod: 'STK_PUSH' as const,
        agreedToTerms: true,
        consentToDataProcessing: true,
        membershipType: 'INDIVIDUAL' as const,
      };

      let response;
      await act(async () => {
        response = await result.current.submitRegistration(registrationData);
      });

      expect(apiClientAdapter.post).toHaveBeenCalledWith('/members/register', registrationData);
      expect(result.current.memberId).toBe('mem-123');
      expect(result.current.membershipNumber).toBe('WIRIA-2024-001');
      expect(result.current.checkoutRequestId).toBe('req-789');
      expect(result.current.paymentStatus).toBe('PENDING');
      expect(notificationService.success).toHaveBeenCalled();
      expect(response).toEqual(
        expect.objectContaining({
          success: true,
          memberId: 'mem-123',
          membershipNumber: 'WIRIA-2024-001',
        })
      );
    });

    it('should successfully register with Manual payment', async () => {
      const mockResponse = {
        data: {
          member: {
            id: 'mem-124',
            membershipNumber: 'WIRIA-2024-002',
            status: 'PENDING',
          },
          message: 'Registration successful',
        },
      };

      vi.mocked(apiClientAdapter.post).mockResolvedValue(mockResponse as never);

      const { result } = renderHook(() => useRegistration());

      const registrationData = {
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: '1992-05-15',
        gender: 'FEMALE' as const,
        nationalId: '87654321',
        email: 'jane@example.com',
        phoneNumber: '+254723456789',
        county: 'Homa Bay',
        subCounty: 'Ndhiwa',
        ward: 'Central Kanyamkago',
        village: 'Another Village',
        membershipFee: 500,
        paymentMethod: 'MANUAL' as const,
        agreedToTerms: true,
        consentToDataProcessing: true,
        membershipType: 'INDIVIDUAL' as const,
      };

      await act(async () => {
        await result.current.submitRegistration(registrationData);
      });

      expect(result.current.checkoutRequestId).toBeNull();
      expect(notificationService.success).toHaveBeenCalled();
    });

    it('should handle registration failure', async () => {
      vi.mocked(apiClientAdapter.post).mockRejectedValue(new Error('Network error') as never);

      const { result } = renderHook(() => useRegistration());

      const registrationData = {
        firstName: 'Test',
        lastName: 'User',
        dateOfBirth: '1990-01-01',
        gender: 'MALE' as const,
        nationalId: '12345678',
        email: 'test@example.com',
        phoneNumber: '+254712345678',
        county: 'Homa Bay',
        subCounty: 'Ndhiwa',
        ward: 'Test Ward',
        village: 'Test Village',
        membershipFee: 500,
        paymentMethod: 'STK_PUSH' as const,
        agreedToTerms: true,
        consentToDataProcessing: true,
        membershipType: 'INDIVIDUAL' as const,
      };

      let response;
      await act(async () => {
        response = await result.current.submitRegistration(registrationData);
      });

      expect(notificationService.error).toHaveBeenCalledWith(
        'Registration failed. Please try again.'
      );
      expect(response).toEqual({ success: false });
    });
  });

  describe('checkPaymentStatus', () => {
    it('should check payment status successfully', async () => {
      const mockResponse = {
        data: {
          status: 'COMPLETED',
        },
      };

      vi.mocked(apiClientAdapter.get).mockResolvedValue(mockResponse as never);

      const { result } = renderHook(() => useRegistration());

      let status;
      await act(async () => {
        status = await result.current.checkPaymentStatus('mem-123');
      });

      expect(result.current.paymentStatus).toBe('COMPLETED');
      expect(notificationService.success).toHaveBeenCalledWith(
        expect.stringContaining('membership is now active')
      );
      expect(status).toBe('COMPLETED');
    });
  });

  describe('resetRegistration', () => {
    it('should reset all registration state', () => {
      const { result } = renderHook(() => useRegistration());

      act(() => {
        result.current.resetRegistration();
      });

      expect(result.current.memberId).toBeNull();
      expect(result.current.membershipNumber).toBeNull();
      expect(result.current.checkoutRequestId).toBeNull();
      expect(result.current.paymentStatus).toBeNull();
      expect(result.current.isSubmitting).toBe(false);
    });
  });
});
