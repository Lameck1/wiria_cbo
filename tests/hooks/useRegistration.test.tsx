/**
 * useRegistration Hook Tests
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { useRegistration } from '@/features/membership/hooks/useRegistration';
import { apiClient } from '@/shared/services/api/client';
import { notificationService } from '@/shared/services/notification/notificationService';

vi.mock('@/shared/services/api/client');
vi.mock('@/shared/services/notification/notificationService');

describe('useRegistration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

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

      expect(apiClient.post).toHaveBeenCalledWith('/members/register', registrationData);
      expect(result.current.memberId).toBe('mem-123');
      expect(result.current.membershipNumber).toBe('WIRIA-2024-001');
      expect(result.current.checkoutRequestId).toBe('req-789');
      expect(result.current.paymentStatus).toBe('PENDING');
      expect(notificationService.info).toHaveBeenCalled();
      expect(response).toEqual({
        success: true,
        memberId: 'mem-123',
        membershipNumber: 'WIRIA-2024-001',
      });
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

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

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
      vi.mocked(apiClient.post).mockRejectedValue(new Error('Network error'));

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

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

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
