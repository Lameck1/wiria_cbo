import { createContext } from 'react';

import type { DashboardStats } from '../api/dashboard.api';
import type { TrendData } from '../hooks/useDashboardData';

export interface DashboardContextValue {
  stats: DashboardStats;
  trends: TrendData;
  canAccessModule: (module: string) => boolean;
  userFirstName: string;
}

export const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);
