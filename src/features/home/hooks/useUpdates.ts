/**
 * Custom hook to fetch recent updates from API
 * Falls back to static data when backend is unavailable
 */

import { useQuery } from '@tanstack/react-query';

import { staticUpdates } from '@/shared/data/static';
import { useBackendStatus } from '@/shared/services/useBackendStatus';

export interface Update {
  id: string;
  title: string;
  excerpt: string;
  fullContent: string;
  category: string;
  imageUrl: string;
  images?: string[];
  publishedAt?: string;
  date?: string;
}

interface UpdatesResponse {
  data: {
    data: Update[];
  };
}

async function fetchUpdates(limit = 20): Promise<Update[]> {
  const response = await fetch(`/api/updates?limit=${limit}`);

  if (!response.ok) {
    throw new Error('Failed to fetch updates');
  }

  const data = (await response.json()) as UpdatesResponse;
  return data.data?.data || data.data || [];
}

export function useUpdates(limit = 20) {
  const { isBackendConnected, isChecking } = useBackendStatus();

  return useQuery({
    queryKey: ['updates', limit, isBackendConnected],
    queryFn: () => {
      // Use static data when backend is offline
      if (!isBackendConnected) {
        return Promise.resolve(staticUpdates.slice(0, limit));
      }
      return fetchUpdates(limit);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !isChecking, // Wait until backend status is determined
  });
}
