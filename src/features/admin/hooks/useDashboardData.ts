import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

import { apiClient } from '@/shared/services/api/client';
import { UserRole } from '@/shared/types';
import { extractData } from '@/shared/utils/apiUtils';

import { getDashboardStats, DashboardStats } from '../api/dashboard.api';

/** Trend data structure for charts */
export interface TrendData {
    donations: { month: string; amount: number }[];
    members: { month: string; count: number }[];
}

/** API response type for trends endpoint */
interface TrendsResponse {
    donations: { month: string; amount: number }[];
    members: { month: string; count: number }[];
}

const DASHBOARD_KEYS = {
    all: ['admin', 'dashboard'] as const,
    stats: () => [...DASHBOARD_KEYS.all, 'stats'] as const,
    trends: () => [...DASHBOARD_KEYS.all, 'trends'] as const,
};

/**
 * Hook for fetching dashboard statistics
 */
export function useDashboardStats() {
    return useQuery<DashboardStats>({
        queryKey: DASHBOARD_KEYS.stats(),
        queryFn: getDashboardStats,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

/**
 * Suspense-enabled hook for dashboard statistics
 */
export function useSuspenseDashboardStats() {
    return useSuspenseQuery<DashboardStats>({
        queryKey: DASHBOARD_KEYS.stats(),
        queryFn: getDashboardStats,
        staleTime: 1000 * 60 * 5,
    });
}

/**
 * Hook for fetching dashboard trend data
 */
export function useDashboardTrends() {
    return useQuery<TrendData>({
        queryKey: DASHBOARD_KEYS.trends(),
        queryFn: async () => {
            return apiClient.get<TrendsResponse>('/admin/trends');
        },
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
}

/**
 * Suspense-enabled hook for dashboard statistics
 */
export function useSuspenseDashboardTrends() {
    return useSuspenseQuery<TrendData>({
        queryKey: DASHBOARD_KEYS.trends(),
        queryFn: async () => {
            const response = await apiClient.get<TrendsResponse>('/admin/trends');
            return extractData<TrendData>(response) || { donations: [], members: [] };
        },
        staleTime: 1000 * 60 * 10,
    });
}

/**
 * Combined hook for dashboard page data and utilities
 */
export function useDashboardData() {
    const statsQuery = useDashboardStats();
    const trendsQuery = useDashboardTrends();

    return {
        stats: statsQuery.data ?? null,
        trends: trendsQuery.data ?? null,
        isLoading: statsQuery.isLoading,
        isTrendsLoading: trendsQuery.isLoading,
        error: statsQuery.error ? 'Failed to load dashboard data. Please try again.' : null,
        refetch: statsQuery.refetch,
    };
}

/**
 * Role-based access utilities
 */
const RESTRICTED_MODULES = ['members', 'users', 'safeguarding'] as const;

type RestrictedModule = (typeof RESTRICTED_MODULES)[number];

/**
 * Checks if a user can access a specific admin module
 */
export function canAccessModule(role: UserRole | undefined, module: string): boolean {
    if (!role) return false;
    if (role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN) return true;
    return !RESTRICTED_MODULES.includes(module as RestrictedModule);
}

/**
 * Currency formatting utility
 */
export function formatCurrency(amount: number): string {
    return `KES ${amount.toLocaleString()}`;
}
