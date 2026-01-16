import { ReactNode } from 'react';

import { useAuth } from '@/features/auth/context/useAuth';

import { DashboardContext, type DashboardContextValue } from './DashboardContextBase';
import {
  canAccessModule as checkModuleAccess,
  useSuspenseDashboardStats,
  useSuspenseDashboardTrends,
} from '../hooks/useDashboardData';

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
export default DashboardProvider;
