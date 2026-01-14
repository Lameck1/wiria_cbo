/**
 * useCareers Hook (Updated)

 * Falls back to static data when backend is unavailable
 */

import { useQuery } from '@tanstack/react-query';

import { staticCareers } from '@/shared/data/static';
import { useBackendStatus } from '@/shared/services/backendStatus';

export interface Job {
  id: string;
  title: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'CONSULTANCY';
  location: string;
  deadline: string;
  salary?: string | null;
  summary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  desirable: string[];
  status: 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

interface CareersResponse {
  success: boolean;
  data: Job[];
}

async function fetchCareers(): Promise<Job[]> {
  const response = await fetch('/api/careers');
  if (!response.ok) {
    throw new Error('Failed to fetch careers');
  }
  const data: CareersResponse = await response.json();
  return data.data || [];
}

export function useCareers() {
  const { isBackendConnected, isChecking } = useBackendStatus();

  return useQuery({
    queryKey: ['careers', isBackendConnected],
    queryFn: () => {
      // Use static data when backend is offline
      if (!isBackendConnected) {
        return Promise.resolve(staticCareers);
      }
      return fetchCareers();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !isChecking, // Wait until backend status is determined
  });
}
