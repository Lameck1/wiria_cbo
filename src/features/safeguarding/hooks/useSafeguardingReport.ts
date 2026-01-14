import { useState } from 'react';

import { useBackendStatus } from '@/shared/services/backendStatus';
import { emailJsService } from '@/shared/services/emailJsService';
import { notificationService } from '@/shared/services/notification/notificationService';

import { safeguardingApi } from '../api/safeguardingApi';

export interface SafeguardingReportData {
  isAnonymous: boolean;
  reporterName?: string;
  reporterEmail?: string;
  reporterPhone?: string;
  reporterRelation?: string;
  category: string;
  incidentDate?: string;
  location?: string;
  personsInvolved?: string;
  description: string;
}

export interface ReportLookupResult {
  referenceNumber: string;
  status: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export function useSafeguardingReport() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [submittedReference, setSubmittedReference] = useState<string | null>(null);
  const [lookupResult, setLookupResult] = useState<ReportLookupResult | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const { isBackendConnected } = useBackendStatus();

  const submitReport = async (
    data: SafeguardingReportData,
    evidenceFile?: File
  ): Promise<boolean> => {
    setIsSubmitting(true);
    setSubmittedReference(null);

    try {
      if (isBackendConnected) {
        try {
          const result = await safeguardingApi.submit(data, evidenceFile);
          setSubmittedReference(result.data.referenceNumber);
          notificationService.success(
            'Report submitted successfully. Please save your reference number.'
          );
          return true;
        } catch (apiError) {
          console.warn(
            '[useSafeguardingReport] Primary API failed, attempting EmailJS fallback...',
            apiError
          );
          await emailJsService.sendSafeguardingReport(data);
          notificationService.success(
            'Your report has been submitted directly to our safeguarding team via our offline channel.'
          );
          return true;
        }
      } else {
        await emailJsService.sendSafeguardingReport(data);
        notificationService.success(
          'Your report has been submitted directly to our safeguarding team via our offline channel.'
        );
        return true;
      }
    } catch (error) {
      console.error('[useSafeguardingReport] Report submission failed:', error);
      notificationService.error(
        'Failed to submit report. Please try again or contact us directly.'
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const lookupStatus = async (referenceNumber: string, email?: string): Promise<boolean> => {
    setIsLookingUp(true);
    setLookupResult(null);
    setLookupError(null);

    try {
      const result = await safeguardingApi.lookup(referenceNumber, email);
      setLookupResult(result.data);
      return true;
    } catch {
      setLookupError('Report not found. Please check your reference number.');
      return false;
    } finally {
      setIsLookingUp(false);
    }
  };

  const resetSubmission = () => setSubmittedReference(null);
  const resetLookup = () => {
    setLookupResult(null);
    setLookupError(null);
  };

  return {
    submitReport,
    lookupStatus,
    isSubmitting,
    isLookingUp,
    submittedReference,
    lookupResult,
    lookupError,
    resetSubmission,
    resetLookup,
  };
}
