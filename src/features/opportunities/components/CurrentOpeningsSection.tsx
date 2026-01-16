/**
 * CurrentOpeningsSection Component
 * Manages data fetching, filtering, and modal state

 */

import { useState, useMemo, useCallback } from 'react';

import { motion } from 'framer-motion';

import { ApplicationModal } from '@/features/applications/components/ApplicationModal';

import { EmptyStateView } from './EmptyStateView';
import { OpportunityCard } from './OpportunityCard';
import { OpportunityFilters } from './OpportunityFilters';
import { OpportunityModal } from './OpportunityModal';
import { useOpportunities } from '../hooks/useOpportunities';

import type { OpportunityTypeFilter } from './OpportunityFilters';
import type { Opportunity } from '../hooks/useOpportunities';

type ModalView = 'none' | 'details' | 'apply';

interface CurrentOpeningsSectionProps {
  initialTypeFilter?: OpportunityTypeFilter;
}

export function CurrentOpeningsSection({ initialTypeFilter = 'ALL' }: CurrentOpeningsSectionProps) {
  const { data: opportunities = [], isLoading, isError } = useOpportunities();
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [modalView, setModalView] = useState<ModalView>('none');
  const [typeFilter, setTypeFilter] = useState<OpportunityTypeFilter>(initialTypeFilter);
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(opportunities.map((o) => o.category));
    return [...cats].sort();
  }, [opportunities]);

  // Filter opportunities
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      const matchesType = typeFilter === 'ALL' || opp.type === typeFilter;
      const matchesCategory = !categoryFilter || opp.category === categoryFilter;
      return matchesType && matchesCategory;
    });
  }, [opportunities, typeFilter, categoryFilter]);

  const hasActiveFilters = typeFilter !== 'ALL' || categoryFilter !== '';

  const handleViewDetails = useCallback((opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setModalView('details');
  }, []);

  const handleApplyNow = useCallback(() => {
    setModalView('apply');
  }, []);

  const handleBackToDetails = useCallback(() => {
    setModalView('details');
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedOpportunity(null);
    setModalView('none');
  }, []);

  const handleClearFilters = useCallback(() => {
    setTypeFilter('ALL');
    setCategoryFilter('');
  }, []);

  return (
    <>
      <div id="current-openings" className="mt-16 scroll-mt-24">
        {/* Section Header */}
        <div className="mb-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 text-3xl font-bold text-wiria-blue-dark"
          >
            Current Openings
          </motion.h2>
          <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-wiria-yellow to-wiria-green-light" />
        </div>

        {/* Filters */}
        {!isLoading && opportunities.length > 0 && (
          <OpportunityFilters
            selectedType={typeFilter}
            onTypeChange={setTypeFilter}
            categories={categories}
            selectedCategory={categoryFilter}
            onCategoryChange={setCategoryFilter}
          />
        )}

        {/* Listings */}
        <div className="mx-auto max-w-4xl space-y-6">
          {isLoading ? (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-wiria-blue-dark" />
              <p className="text-gray-600">Loading opportunities...</p>
            </div>
          ) : isError ? (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
              <p className="text-red-500">Failed to load opportunities. Please try again later.</p>
            </div>
          ) : filteredOpportunities.length === 0 ? (
            <EmptyStateView hasFilters={hasActiveFilters} onClearFilters={handleClearFilters} />
          ) : (
            <>
              {/* Results Count */}
              <p className="mb-4 text-center text-sm text-gray-500">
                Showing {filteredOpportunities.length} of {opportunities.length} opportunities
              </p>
              {filteredOpportunities.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  onViewDetails={() => handleViewDetails(opp)}
                />
              ))}
            </>
          )}
        </div>
      </div>

      {/* Details Modal */}
      <OpportunityModal
        opportunity={selectedOpportunity}
        isOpen={modalView === 'details'}
        onClose={handleCloseModal}
        onApply={handleApplyNow}
      />

      {/* Unified Application Modal */}
      <ApplicationModal
        isOpen={modalView === 'apply'}
        onClose={handleCloseModal}
        onBack={handleBackToDetails}
        title={selectedOpportunity?.title ?? ''}
        itemId={selectedOpportunity?.id ?? ''}
        type="OPPORTUNITY"
      />
    </>
  );
}
