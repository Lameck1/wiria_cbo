import { apiClient } from '@/shared/services/api/client';
import { API_ENDPOINTS } from '@/shared/services/api/endpoints';

import { SafeguardingReportData, ReportLookupResult } from '../hooks/useSafeguardingReport';

export const safeguardingApi = {
    submit: async (data: SafeguardingReportData, evidenceFile?: File) => {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                formData.append(key, String(value));
            }
        });

        if (evidenceFile) {
            formData.append('evidence', evidenceFile);
        }

        // apiClient doesn't support FormData directly in its post method currently
        // because it forces 'application/json'. 
        // For now, we'll use a direct fetch or update apiClient.
        const API_BASE_URL = import.meta.env['VITE_API_BASE_URL'] ?? 'http://localhost:5001/api';
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SAFEGUARDING_SUBMIT}`, {
            method: 'POST',
            body: formData,
            // Note: No headers for FormData, browser sets it with boundary
        });

        if (!response.ok) {
            throw new Error('Failed to submit report');
        }

        return response.json();
    },

    lookup: async (referenceNumber: string, email?: string) => {
        return apiClient.post<{ data: ReportLookupResult }>(API_ENDPOINTS.SAFEGUARDING_LOOKUP, {
            referenceNumber,
            email,
        });
    }
};
