import {
  useQuery,
  useSuspenseQuery,
  type UseQueryResult,
  type UseSuspenseQueryResult,
} from '@tanstack/react-query';

import { TIMING } from '@/shared/constants/config';
import { apiClient } from '@/shared/services/api/client';
import { UserRole } from '@/shared/types';
import { extractData } from '@/shared/utils/apiUtils';

import { getDashboardStats } from '../api/dashboard.api';

import type { DashboardStats } from '../api/dashboard.api';

export interface TrendPointBase {
  month: string;
}

export interface DonationTrendPoint extends TrendPointBase {
  amount: number;
}

export interface MemberTrendPoint extends TrendPointBase {
  count: number;
}

/** Trend data structure for charts and API responses */
export interface TrendData {
  donations: DonationTrendPoint[];
  members: MemberTrendPoint[];
}

type TrendsResponse = TrendData;

const DASHBOARD_KEYS = {
  all: ['admin', 'dashboard'] as const,
  stats: () => [...DASHBOARD_KEYS.all, 'stats'] as const,
  trends: () => [...DASHBOARD_KEYS.all, 'trends'] as const,
};

export function useDashboardStats(): UseQueryResult<DashboardStats> {
  return useQuery<DashboardStats>({
    queryKey: DASHBOARD_KEYS.stats(),
    queryFn: getDashboardStats,
    staleTime: TIMING.QUERY_DEFAULT_STALE_TIME,
  });
}

export function useSuspenseDashboardStats(): UseSuspenseQueryResult<DashboardStats> {
  return useSuspenseQuery<DashboardStats>({
    queryKey: DASHBOARD_KEYS.stats(),
    queryFn: getDashboardStats,
    staleTime: TIMING.QUERY_DEFAULT_STALE_TIME,
  });
}

export function useDashboardTrends(): UseQueryResult<TrendData> {
  return useQuery<TrendData>({
    queryKey: DASHBOARD_KEYS.trends(),
    queryFn: async () => {
      return apiClient.get<TrendsResponse>('/admin/trends');
    },
    staleTime: TIMING.QUERY_DEFAULT_STALE_TIME,
  });
}

export function useSuspenseDashboardTrends(): UseSuspenseQueryResult<TrendData> {
  return useSuspenseQuery<TrendData>({
    queryKey: DASHBOARD_KEYS.trends(),
    queryFn: async () => {
      const response = await apiClient.get<TrendsResponse>('/admin/trends');
      return extractData<TrendData>(response) ?? { donations: [], members: [] };
    },
    staleTime: TIMING.QUERY_DEFAULT_STALE_TIME,
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
