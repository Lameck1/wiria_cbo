/**
 * useResources Hook
 * Fetches public resources/documents from API
 * Falls back to static data when backend is unavailable
 */

import { useQuery } from '@tanstack/react-query';

import { staticResources } from '@/shared/data/static';
import { useBackendStatus } from '@/shared/services/backendStatus';

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'GOVERNANCE' | 'STRATEGIC' | 'FINANCIAL' | 'POLICIES' | 'REPORTS' | 'OTHER';
  fileType: string;
  fileSize: string;
  downloadUrl?: string | null;
  summary: string;
  keyPoints: string[];
  isPublic: boolean;
  downloads: number;
  uploadedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface ResourcesApiResponse {
  success: boolean;
  message: string;
  data: {
    data: Resource[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

async function fetchResources(): Promise<Resource[]> {
  const response = await fetch('/api/resources');
  if (!response.ok) {
    throw new Error('Failed to fetch resources');
  }
  const data: ResourcesApiResponse = await response.json();
  return data.data?.data || [];
}

export function useResources() {
  const { isBackendConnected, isChecking } = useBackendStatus();

  return useQuery({
    queryKey: ['resources', isBackendConnected],
    queryFn: () => {
      // Use static data when backend is offline
      if (!isBackendConnected) {
        return Promise.resolve(staticResources);
      }
      return fetchResources();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !isChecking, // Wait until backend status is determined
  });
}
