/**
 * Safeguarding API Service
 * Handles safeguarding report management for admin
 */

import { apiClient } from '@/shared/services/api/client';
import { extractArray, extractData } from '@/shared/utils/apiUtils';

export interface SafeguardingReport {
  id: string;
  referenceNumber: string;
  isAnonymous: boolean;
  reporterName?: string;
  reporterEmail?: string;
  reporterPhone?: string;
  incidentType:
    | 'CHILD_PROTECTION'
    | 'SEXUAL_EXPLOITATION'
    | 'HARASSMENT'
    | 'DISCRIMINATION'
    | 'FRAUD'
    | 'OTHER';
  incidentDate: string;
  incidentLocation: string;
  description: string;
  personsInvolved?: string;
  witnessInfo?: string;
  evidenceUrl?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PENDING' | 'UNDER_REVIEW' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED';
  assignedTo?: string;
  resolution?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SafeguardingStatistics {
  total: number;
  pending: number;
  underReview: number;
  investigating: number;
  resolved: number;
  closed: number;
  critical: number;
  high: number;
}

export const getSafeguardingReports = async (params?: {
  status?: string;
  priority?: string;
}): Promise<SafeguardingReport[]> => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.priority) searchParams.append('priority', params.priority);
    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const response = await apiClient.get(`/safeguarding${queryString}`);
    return extractArray<SafeguardingReport>(response);
  } catch (error) {
    console.error('Failed to fetch safeguarding reports:', error);
    return [];
  }
};

export const getSafeguardingReportById = async (id: string): Promise<SafeguardingReport | null> => {
  try {
    const response = await apiClient.get(`/safeguarding/${id}`);
    return extractData<SafeguardingReport>(response);
  } catch (error) {
    console.error('Failed to fetch safeguarding report:', error);
    return null;
  }
};

export const updateSafeguardingReport = async (
  id: string,
  data: Partial<SafeguardingReport>
): Promise<boolean> => {
  try {
    await apiClient.patch(`/safeguarding/${id}`, data);
    return true;
  } catch (error) {
    console.error('Failed to update safeguarding report:', error);
    throw error;
  }
};

export const assignSafeguardingReport = async (
  id: string,
  assignedTo: string
): Promise<boolean> => {
  try {
    await apiClient.post(`/safeguarding/${id}/assign`, { assignedTo });
    return true;
  } catch (error) {
    console.error('Failed to assign safeguarding report:', error);
    throw error;
  }
};

export const resolveSafeguardingReport = async (
  id: string,
  resolution: string
): Promise<boolean> => {
  try {
    await apiClient.post(`/safeguarding/${id}/resolve`, { resolution });
    return true;
  } catch (error) {
    console.error('Failed to resolve safeguarding report:', error);
    throw error;
  }
};

export const getSafeguardingStatistics = async (): Promise<SafeguardingStatistics> => {
  try {
    const response = await apiClient.get('/safeguarding/statistics');
    return (
      extractData<SafeguardingStatistics>(response) ?? {
        total: 0,
        pending: 0,
        underReview: 0,
        investigating: 0,
        resolved: 0,
        closed: 0,
        critical: 0,
        high: 0,
      }
    );
  } catch (error) {
    console.error('Failed to fetch safeguarding statistics:', error);
    return {
      total: 0,
      pending: 0,
      underReview: 0,
      investigating: 0,
      resolved: 0,
      closed: 0,
      critical: 0,
      high: 0,
    };
  }
};
