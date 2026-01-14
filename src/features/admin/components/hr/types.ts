/**
 * HR Management Types
 * Shared interfaces for HR-related components
 */

import { Career } from '@/features/admin/api/careers.api';
import { Application, Opportunity } from '@/features/admin/api/opportunities.api';


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

export interface CareerModalProps {
  career: Career | null;
  onClose: () => void;
  onSuccess: () => void;
}

export interface OpportunityModalProps {
  opportunity: Opportunity | null;
  onClose: () => void;
  onSuccess: () => void;
}

export {type Career} from '@/features/admin/api/careers.api';
export {type Application, type Opportunity} from '@/features/admin/api/opportunities.api';