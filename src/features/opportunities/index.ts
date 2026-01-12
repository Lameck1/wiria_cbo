/**
 * Opportunities Feature Module
 * Exports all opportunity-related hooks, components, and constants
 */

// Hooks
export { useOpportunities, type Opportunity } from './hooks/useOpportunities';
export {
  useApplicationForm,
  type ApplicationFormData,
  type SubmitStatus,
} from './hooks/useApplicationForm';

// Page-level Sections
export { CurrentOpeningsSection } from './components/CurrentOpeningsSection';
export { VolunteerInternshipSection } from './components/VolunteerInternshipSection';
export { BenefitsSection } from './components/BenefitsSection';
export { ApplicationTipsSection } from './components/ApplicationTipsSection';
export { OpportunityHeroStats } from './components/OpportunityHeroStats';

// Modal Components
export { OpportunityModal } from './components/OpportunityModal';
export { OpportunityModalContent } from './components/OpportunityModalContent';
export { ApplicationFormModal } from './components/ApplicationFormModal';
export { ApplicationFormFields } from './components/ApplicationFormFields';
export { ApplicationSuccessView } from './components/ApplicationSuccessView';
export { ApplicationErrorView } from './components/ApplicationErrorView';

// Card Components
export { OpportunityCard } from './components/OpportunityCard';
export { OpportunityInfoCards } from './components/OpportunityInfoCards';
export { OpportunityDetailSection } from './components/OpportunityDetailSection';

// Filter Components
export { OpportunityFilters, type OpportunityTypeFilter } from './components/OpportunityFilters';
export { EmptyStateView } from './components/EmptyStateView';

// Utils
export * from './utils/deadlineUtils';

// Constants
export * from './constants/opportunitiesData';
export * from './constants/applicationFormData';
