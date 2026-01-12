/**
 * useTenders Hook
 * Fetches open tenders from API
 * Falls back to static data when backend is unavailable
 */

import { useQuery } from '@tanstack/react-query';
import { useBackendStatus } from '@/shared/services/backendStatus';
import { staticTenders } from '@/shared/data/static';

export interface Tender {
  id: string;
  refNo: string;
  title: string;
  category: string;
  estimatedValue: string;
  deadline: string;
  publishDate: string;
  description: string;
  eligibility: string[];
  requiredDocuments: string[];
  submissionMethod: string;
  submissionAddress: string;
  submissionEmail: string;
  contactPerson: string;
  contactPhone: string;
  downloadUrl: string;
  status: 'OPEN' | 'CLOSED' | 'AWARDED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

interface TendersApiResponse {
  success: boolean;
  message: string;
  data: {
    data: Tender[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

async function fetchTenders(): Promise<Tender[]> {
  const response = await fetch('/api/tenders');
  if (!response.ok) {
    throw new Error('Failed to fetch tenders');
  }
  const data: TendersApiResponse = await response.json();
  return data.data?.data || [];
}

export function useTenders() {
  const { isBackendConnected, isChecking } = useBackendStatus();

  return useQuery({
    queryKey: ['tenders', isBackendConnected],
    queryFn: () => {
      // Use static data when backend is offline
      if (!isBackendConnected) {
        return Promise.resolve(staticTenders);
      }
      return fetchTenders();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !isChecking, // Wait until backend status is determined
  });
}
