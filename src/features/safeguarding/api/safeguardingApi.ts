import { apiClient } from '@/shared/services/api/client';
import { API_ENDPOINTS } from '@/shared/services/api/endpoints';

import type { SafeguardingReportData, ReportLookupResult } from '../hooks/useSafeguardingReport';

export const safeguardingApi = {
  submit: async (
    data: SafeguardingReportData,
    evidenceFile?: File
  ): Promise<{ data: { referenceNumber: string } }> => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        formData.append(key, String(value));
      }
    });

    if (evidenceFile) {
      formData.append('evidence', evidenceFile);
    }

    const API_BASE_URL: string =
      (import.meta.env['VITE_API_BASE_URL'] as string | undefined) ?? 'http://localhost:5001/api';
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SAFEGUARDING_SUBMIT}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to submit report');
    }

    return response.json() as Promise<{ data: { referenceNumber: string } }>;
  },

  lookup: async (referenceNumber: string, email?: string) => {
    return apiClient.post<{ data: ReportLookupResult }>(API_ENDPOINTS.SAFEGUARDING_LOOKUP, {
      referenceNumber,
      email,
    });
  },
};
