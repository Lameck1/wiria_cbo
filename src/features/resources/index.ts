/**
 * Resources Feature Module
 * Exports all resources-related hooks, components, and types
 */

// Hooks
export { useResources, type Resource } from './hooks/useResources';
export { useTenders, type Tender } from './hooks/useTenders';

// Page Sections
export { DocumentRepositorySection } from './components/DocumentRepositorySection';
export { ActiveTendersSection } from './components/ActiveTendersSection';
export { ResourcesHeroStats } from './components/ResourcesHeroStats';

// Components
export { DocumentCard } from './components/DocumentCard';
export { DocumentModal } from './components/DocumentModal';
export { DocumentCardSkeleton } from './components/DocumentCardSkeleton';
export { TenderCard } from './components/TenderCard';
export { TenderModal } from './components/TenderModal';
export { TenderCardSkeleton, TenderTableRowSkeleton } from './components/TenderCardSkeleton';
