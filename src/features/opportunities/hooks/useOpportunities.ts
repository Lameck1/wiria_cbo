/**
 * Custom hook to fetch opportunities from API
 * Falls back to static data when backend is unavailable
 */

import { useQuery } from '@tanstack/react-query';

import { staticOpportunities } from '@/shared/data/static';
import { useBackendStatus } from '@/shared/services/backendStatus';

export interface Opportunity {
  id: string;
  title: string;
  type: 'VOLUNTEER' | 'INTERNSHIP';
  category: string;
  duration: string;
  location: string;
  deadline: string;
  summary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  status: 'ACTIVE' | 'CLOSED' | 'DRAFT';
  createdAt: string;
  updatedAt: string;
}

interface OpportunitiesResponse {
  success: boolean;
  message: string;
  data: {
    data: Opportunity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

async function fetchOpportunities(): Promise<Opportunity[]> {
  const response = await fetch('/api/opportunities');

  if (!response.ok) {
    throw new Error('Failed to fetch opportunities');
  }

  const data: OpportunitiesResponse = await response.json();
  return data.data?.data || [];
}

export function useOpportunities() {
  const { isBackendConnected, isChecking } = useBackendStatus();

  return useQuery({
    queryKey: ['opportunities', isBackendConnected],
    queryFn: () => {
      // Use static data when backend is offline
      if (!isBackendConnected) {
        return Promise.resolve(staticOpportunities);
      }
      return fetchOpportunities();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !isChecking, // Wait until backend status is determined
  });
}
