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
            const [contactRes, appRes, safeRes] = await Promise.allSettled([
                apiClient.get<{ data: any }>('/contact/statistics'),
                apiClient.get<{ data: any }>('/admin/applications/statistics'),
                apiClient.get<{ data: any }>('/safeguarding/statistics'),
            ]);

            const counts: NotificationCounts = {
                pendingApplications: 0,
                unreadMessages: 0,
                criticalCases: 0,
            };

            if (contactRes.status === 'fulfilled') {
                const data = contactRes.value.data || contactRes.value;
                counts.unreadMessages = data.new || data.unread || data.pending || 0;
            }

            if (appRes.status === 'fulfilled') {
                const data = appRes.value.data || appRes.value;
                counts.pendingApplications = data.pending || 0;
            }

            if (safeRes.status === 'fulfilled') {
                const data = safeRes.value.data || safeRes.value;
                counts.criticalCases = data.critical || data.high || 0;
            }

            return counts;
        },
        enabled,
        refetchInterval: 1000 * 30, // 30 seconds
        staleTime: 1000 * 10,     // 10 seconds
    });
}
