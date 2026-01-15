/**
 * Custom hook to fetch partners from API
 * Falls back to static data when backend is unavailable
 */

import { useQuery } from '@tanstack/react-query';

import { staticPartners } from '@/shared/data/static';
import { useBackendStatus } from '@/shared/services/backendStatus';

export interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  type?: string;
  description?: string;
}

interface PartnersResponse {
  data: {
    data: Partner[];
  };
}

async function fetchPartners(): Promise<Partner[]> {
  const response = await fetch('/api/partners');

  if (!response.ok) {
    throw new Error('Failed to fetch partners');
  }

  const data = (await response.json()) as PartnersResponse;
  return data.data?.data || data.data || [];
}

export function usePartners() {
  const { isBackendConnected, isChecking } = useBackendStatus();

  return useQuery({
    queryKey: ['partners', isBackendConnected],
    queryFn: () => {
      // Use static data when backend is offline
      if (!isBackendConnected) {
        return Promise.resolve(staticPartners);
      }
      return fetchPartners();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !isChecking, // Wait until backend status is determined
  });
}
