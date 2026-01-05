/**
 * CurrentOpeningsSection Component
 * Manages data fetching, filtering, and modal state
 * Composes cards, filters, and modals
 */

import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useOpportunities, Opportunity } from '../hooks/useOpportunities';
import { OpportunityCard } from './OpportunityCard';
import { OpportunityModal } from './OpportunityModal';
import { ApplicationFormModal } from './ApplicationFormModal';
import { OpportunityFilters, OpportunityTypeFilter } from './OpportunityFilters';
import { EmptyStateView } from './EmptyStateView';

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
        const cats = new Set(opportunities.map(o => o.category));
        return Array.from(cats).sort();
    }, [opportunities]);

    // Filter opportunities
    const filteredOpportunities = useMemo(() => {
        return opportunities.filter(opp => {
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
                <div className="text-center mb-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold text-wiria-blue-dark mb-4"
                    >
                        Current Openings
                    </motion.h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-wiria-yellow to-wiria-green-light mx-auto rounded-full" />
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
                <div className="space-y-6 max-w-4xl mx-auto">
                    {isLoading ? (
                        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wiria-blue-dark mx-auto mb-4" />
                            <p className="text-gray-600">Loading opportunities...</p>
                        </div>
                    ) : isError ? (
                        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                            <p className="text-red-500">Failed to load opportunities. Please try again later.</p>
                        </div>
                    ) : filteredOpportunities.length === 0 ? (
                        <EmptyStateView
                            hasFilters={hasActiveFilters}
                            onClearFilters={handleClearFilters}
                        />
                    ) : (
                        <>
                            {/* Results Count */}
                            <p className="text-sm text-gray-500 text-center mb-4">
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

            {/* Application Form Modal */}
            <ApplicationFormModal
                opportunity={selectedOpportunity}
                isOpen={modalView === 'apply'}
                onClose={handleCloseModal}
                onBack={handleBackToDetails}
            />
        </>
    );
}
