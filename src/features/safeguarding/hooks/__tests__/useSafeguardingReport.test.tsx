import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { safeguardingApi } from '@/features/safeguarding/api/safeguardingApi';
import type { SafeguardingReportData } from '@/features/safeguarding/hooks/useSafeguardingReport';
import { useSafeguardingReport } from '@/features/safeguarding/hooks/useSafeguardingReport';
import { emailJsService } from '@/shared/services/emailJsService';
import { logger } from '@/shared/services/logger';
import { notificationService } from '@/shared/services/notification/notificationService';
import { useBackendStatus } from '@/shared/services/useBackendStatus';

vi.mock('@/shared/services/useBackendStatus');
vi.mock('@/features/safeguarding/api/safeguardingApi');
vi.mock('@/shared/services/emailJsService');
vi.mock('@/shared/services/logger');
vi.mock('@/shared/services/notification/notificationService');

const createReportData = (overrides: Partial<SafeguardingReportData> = {}): SafeguardingReportData => ({
  isAnonymous: false,
  reporterName: 'Test Reporter',
  reporterEmail: 'reporter@example.com',
  reporterPhone: '+254712345678',
  reporterRelation: 'Witness',
  category: 'ABUSE',
  incidentDate: '2024-01-01',
  location: 'Community Center',
  personsInvolved: 'Test Person',
  description: 'Test description',
  ...overrides,
});

describe('useSafeguardingReport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useBackendStatus).mockReturnValue({
      isBackendConnected: true,
      isChecking: false,
    });
  });

  describe('submitReport', () => {
    it('submits via primary API when backend is connected', async () => {
      const mockReference = 'SAFE-123';
      vi.mocked(safeguardingApi.submit).mockResolvedValue({
        data: { referenceNumber: mockReference },
      } as never);

      const { result } = renderHook(() => useSafeguardingReport());

      let success = false;
      await act(async () => {
        success = await result.current.submitReport(createReportData());
      });

      expect(success).toBe(true);
      expect(safeguardingApi.submit).toHaveBeenCalled();
      expect(result.current.submittedReference).toBe(mockReference);
      expect(notificationService.success).toHaveBeenCalledWith(
        'Report submitted successfully. Please save your reference number.'
      );
    });

    it('falls back to EmailJS if primary API fails while backend is connected', async () => {
      vi.mocked(safeguardingApi.submit).mockRejectedValue(new Error('API down'));
      vi.mocked(emailJsService.sendSafeguardingReport).mockResolvedValue({
        status: 'SUCCESS',
        message: 'Fallback ok',
      });

      const { result } = renderHook(() => useSafeguardingReport());

      let success = false;
      await act(async () => {
        success = await result.current.submitReport(createReportData());
      });

      expect(success).toBe(true);
      expect(logger.warn).toHaveBeenCalledWith(
        '[useSafeguardingReport] Primary API failed, attempting EmailJS fallback...',
        expect.any(Error)
      );
      expect(emailJsService.sendSafeguardingReport).toHaveBeenCalled();
      expect(notificationService.success).toHaveBeenCalledWith(
        'Your report has been submitted directly to our safeguarding team via our offline channel.'
      );
    });

    it('uses EmailJS directly when backend is offline', async () => {
      vi.mocked(useBackendStatus).mockReturnValue({
        isBackendConnected: false,
        isChecking: false,
      });

      vi.mocked(emailJsService.sendSafeguardingReport).mockResolvedValue({
        status: 'SUCCESS',
        message: 'Offline ok',
      });

      const { result } = renderHook(() => useSafeguardingReport());

      let success = false;
      await act(async () => {
        success = await result.current.submitReport(createReportData());
      });

      expect(success).toBe(true);
      expect(safeguardingApi.submit).not.toHaveBeenCalled();
      expect(emailJsService.sendSafeguardingReport).toHaveBeenCalled();
      expect(notificationService.success).toHaveBeenCalledWith(
        'Your report has been submitted directly to our safeguarding team via our offline channel.'
      );
    });

    it('shows error notification when both API and EmailJS fail', async () => {
      vi.mocked(safeguardingApi.submit).mockRejectedValue(new Error('API down'));
      vi.mocked(emailJsService.sendSafeguardingReport).mockResolvedValue({
        status: 'PROVIDER_ERROR',
        message: 'EmailJS error',
      });

      const { result } = renderHook(() => useSafeguardingReport());

      let success = true;
      await act(async () => {
        success = await result.current.submitReport(createReportData());
      });

      expect(success).toBe(false);
      expect(logger.error).toHaveBeenCalledWith(
        '[useSafeguardingReport] EmailJS fallback failed',
        expect.anything()
      );
      expect(notificationService.error).toHaveBeenCalledWith(
        'Failed to submit report via our alternative channel. Please try again later.'
      );
    });

    it('handles unexpected errors gracefully', async () => {
      vi.mocked(useBackendStatus).mockReturnValue({
        isBackendConnected: false,
        isChecking: false,
      });

      vi.mocked(emailJsService.sendSafeguardingReport).mockImplementation(() => {
        throw new Error('Unexpected');
      });

      const { result } = renderHook(() => useSafeguardingReport());

      let success = true;
      await act(async () => {
        success = await result.current.submitReport(createReportData());
      });

      expect(success).toBe(false);
      expect(logger.error).toHaveBeenCalledWith(
        '[useSafeguardingReport] Report submission failed:',
        expect.any(Error)
      );
      expect(notificationService.error).toHaveBeenCalledWith(
        'Failed to submit report. Please try again or contact us directly.'
      );
    });
  });

  describe('lookupStatus', () => {
    it('successfully looks up report status', async () => {
      const lookupData = {
        referenceNumber: 'SAFE-999',
        status: 'IN_REVIEW',
        category: 'ABUSE',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      };

      vi.mocked(safeguardingApi.lookup).mockResolvedValue({
        data: lookupData,
      } as never);

      const { result } = renderHook(() => useSafeguardingReport());

      let success = false;
      await act(async () => {
        success = await result.current.lookupStatus('SAFE-999', 'user@example.com');
      });

      expect(success).toBe(true);
      expect(safeguardingApi.lookup).toHaveBeenCalledWith('SAFE-999', 'user@example.com');
      expect(result.current.lookupResult).toEqual(lookupData);
      expect(result.current.lookupError).toBeNull();
    });

    it('sets error state when lookup fails', async () => {
      vi.mocked(safeguardingApi.lookup).mockRejectedValue(new Error('Not found'));

      const { result } = renderHook(() => useSafeguardingReport());

      let success = true;
      await act(async () => {
        success = await result.current.lookupStatus('SAFE-000');
      });

      expect(success).toBe(false);
      expect(result.current.lookupResult).toBeNull();
      expect(result.current.lookupError).toBe('Report not found. Please check your reference number.');
    });
  });

  describe('reset helpers', () => {
    it('resetSubmission clears submittedReference', async () => {
      vi.mocked(safeguardingApi.submit).mockResolvedValue({
        data: { referenceNumber: 'SAFE-123' },
      } as never);

      const { result } = renderHook(() => useSafeguardingReport());

      await act(async () => {
        await result.current.submitReport(createReportData());
      });

      expect(result.current.submittedReference).toBe('SAFE-123');

      act(() => {
        result.current.resetSubmission();
      });

      expect(result.current.submittedReference).toBeNull();
    });

    it('resetLookup clears lookupResult and lookupError', async () => {
      vi.mocked(safeguardingApi.lookup).mockRejectedValue(new Error('Not found'));

      const { result } = renderHook(() => useSafeguardingReport());

      await act(async () => {
        await result.current.lookupStatus('SAFE-000');
      });

      expect(result.current.lookupResult).toBeNull();
      expect(result.current.lookupError).toBe(
        'Report not found. Please check your reference number.'
      );

      act(() => {
        result.current.resetLookup();
      });

      expect(result.current.lookupResult).toBeNull();
      expect(result.current.lookupError).toBeNull();
    });
  });
});
