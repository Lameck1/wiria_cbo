import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/shared/services/api/client';

export const ADMIN_KEYS = {
  notifications: ['admin', 'notifications'] as const,
};

export interface NotificationCounts {
  pendingApplications: number;
  unreadMessages: number;
  criticalCases: number;
}

export function useNotificationCountsQuery(enabled = false) {
  return useQuery({
    queryKey: ADMIN_KEYS.notifications,
    queryFn: async () => {
      // Define response types for statistics endpoints
      interface StatisticsResponse {
        data?: {
          new?: number;
          unread?: number;
          pending?: number;
          critical?: number;
          high?: number;
        };
        new?: number;
        unread?: number;
        pending?: number;
        critical?: number;
        high?: number;
      }

      const [contactResult, applicationResult, safeguardingResult] = await Promise.allSettled([
        apiClient.get<StatisticsResponse>('/contact/statistics'),
        apiClient.get<StatisticsResponse>('/admin/applications/statistics'),
        apiClient.get<StatisticsResponse>('/safeguarding/statistics'),
      ]);

      const counts: NotificationCounts = {
        pendingApplications: 0,
        unreadMessages: 0,
        criticalCases: 0,
      };

      if (contactResult.status === 'fulfilled') {
        const data = contactResult.value.data ?? contactResult.value;
        counts.unreadMessages = data.new ?? data.unread ?? data.pending ?? 0;
      }

      if (applicationResult.status === 'fulfilled') {
        const data = applicationResult.value.data ?? applicationResult.value;
        counts.pendingApplications = data.pending ?? 0;
      }

      if (safeguardingResult.status === 'fulfilled') {
        const data = safeguardingResult.value.data ?? safeguardingResult.value;
        counts.criticalCases = data.critical ?? data.high ?? 0;
      }

      return counts;
    },
    enabled,
    refetchInterval: 1000 * 30, // 30 seconds
    staleTime: 1000 * 10, // 10 seconds
  });
}
