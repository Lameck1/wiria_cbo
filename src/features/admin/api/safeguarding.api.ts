/**
 * Safeguarding API Service
 * Handles safeguarding report management for admin
 */

import { apiClient } from '@/shared/services/api/client';
import { logger } from '@/shared/services/logger';
import { extractArray } from '@/shared/utils/apiUtils';

export interface SafeguardingReport {
  id: string;
  referenceNumber: string;
  isAnonymous: boolean;
  reporterName?: string;
  reporterEmail?: string;
  reporterPhone?: string;
  incidentType?:
  | 'CHILD_PROTECTION'
  | 'SEXUAL_EXPLOITATION'
  | 'HARASSMENT'
  | 'DISCRIMINATION'
  | 'FRAUD'
  | 'OTHER';
  category?: string;
  incidentDate: string;
  incidentLocation?: string;
  location?: string;
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
    logger.error('Failed to fetch safeguarding reports:', error);
    throw new Error('Failed to load safeguarding reports. Please try again.');
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
    logger.error('Failed to update safeguarding report:', error);
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
    logger.error('Failed to resolve safeguarding report:', error);
    throw error;
  }
};
