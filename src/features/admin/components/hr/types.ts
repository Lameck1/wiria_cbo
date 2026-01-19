/**
 * HR Management Types
 * Shared interfaces for HR-related components
 */

import type { Career } from '@/features/admin/api/careers.api';
import type { Application, Opportunity } from '@/features/admin/api/opportunities.api';

export interface CareersTabProps {
  careers: Career[];
  applications: Application[];
  onEdit: (career: Career) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
}

export interface OpportunitiesTabProps {
  opportunities: Opportunity[];
  applications: Application[];
  onEdit: (opportunity: Opportunity) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
}

export interface ApplicationsListProps {
  applications: Application[];
  onReview: (app: Application) => void;
}



export { type Career } from '@/features/admin/api/careers.api';
export { type Application, type Opportunity } from '@/features/admin/api/opportunities.api';

