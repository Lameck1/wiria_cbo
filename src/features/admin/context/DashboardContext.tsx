import { createContext, useContext, ReactNode } from 'react';

import { useAuth } from '@/features/auth/context/AuthContext';

import {
  useSuspenseDashboardStats,
  useSuspenseDashboardTrends,
  canAccessModule as checkModuleAccess,
  type TrendData,
} from '../hooks/useDashboardData';

import type { DashboardStats } from '../api/dashboard.api';

interface DashboardContextValue {
  stats: DashboardStats;
  trends: TrendData;
  canAccessModule: (module: string) => boolean;
  userFirstName: string;
}

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

interface DashboardProviderProps {
  children: ReactNode;
}

/**
 * Dashboard Context Provider
 * 
 * Centralizes dashboard data and utilities to eliminate prop drilling.
 * Uses Suspense queries for automatic loading states.
 * 
 * @example
 * ```tsx
 * <DashboardProvider>
 *   <DashboardStatsGrid />
 *   <DashboardTrends />
 * </DashboardProvider>
 * ```
 */
export function DashboardProvider({ children }: DashboardProviderProps) {
  const { user } = useAuth();
  const { data: stats } = useSuspenseDashboardStats();
  const { data: trends } = useSuspenseDashboardTrends();

  const canAccessModule = (module: string) => checkModuleAccess(user?.role, module);

  const value: DashboardContextValue = {
    stats,
    trends,
    canAccessModule,
    userFirstName: user?.firstName ?? 'Admin',
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

/**
 * Hook to access Dashboard context
 * 
 * @throws Error if used outside DashboardProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { stats, canAccessModule } = useDashboard();
 *   return <div>{stats.members.active}</div>;
 * }
 * ```
 */
export function useDashboard(): DashboardContextValue {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
