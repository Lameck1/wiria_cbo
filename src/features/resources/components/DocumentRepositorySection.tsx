/**
 * DocumentRepositorySection Component
 * Displays grid of document cards with category filters, loading skeletons, and better empty state
 */

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResources, Resource } from '../hooks/useResources';
import { DocumentCard } from './DocumentCard';
import { DocumentModal } from './DocumentModal';
import { DocumentCardSkeleton } from './DocumentCardSkeleton';

// Available categories for filtering
const CATEGORIES = [
    { key: 'ALL', label: 'All' },
    { key: 'GOVERNANCE', label: 'Governance' },
    { key: 'STRATEGIC', label: 'Strategic' },
    { key: 'FINANCIAL', label: 'Financial' },
    { key: 'POLICIES', label: 'Policies' },
] as const;

export function DocumentRepositorySection() {
    const { data: resources = [], isLoading, isError } = useResources();
    const [selectedDocument, setSelectedDocument] = useState<Resource | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

    // Filter resources by category
    const filteredResources = useMemo(() => {
        if (selectedCategory === 'ALL') return resources;
        return resources.filter(doc => doc.category === selectedCategory);
    }, [resources, selectedCategory]);

    // Get category counts
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = { ALL: resources.length };
        resources.forEach(doc => {
            counts[doc.category] = (counts[doc.category] || 0) + 1;
        });
        return counts;
    }, [resources]);

    const handleOpenModal = useCallback((doc: Resource) => {
        setSelectedDocument(doc);
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedDocument(null);
    }, []);

    return (
        <>
            <section id="documents" className="py-16 scroll-mt-20">
                <div className="container mx-auto px-4 lg:px-6 max-w-5xl">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-8"
                    >
                        <h2 className="text-3xl font-bold text-wiria-blue-dark mb-4">Document Repository</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-wiria-yellow to-wiria-green-light mx-auto rounded-full" />
                    </motion.div>

                    <p className="text-gray-600 mb-8 text-center max-w-3xl mx-auto">
                        In our commitment to transparency and accountability, we make our key
                        organizational documents available to the public.
                    </p>

                    {/* Category Filter Tabs */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-wrap justify-center gap-2 mb-8"
                    >
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.key}
                                onClick={() => setSelectedCategory(cat.key)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${selectedCategory === cat.key
                                    ? 'bg-wiria-blue-dark text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {cat.label}
                                {(categoryCounts[cat.key] ?? 0) > 0 && (
                                    <span className={`ml-1.5 px-1.5 py-0.5 text-xs rounded-full ${selectedCategory === cat.key
                                        ? 'bg-white/20'
                                        : 'bg-gray-300'
                                        }`}>
                                        {categoryCounts[cat.key] ?? 0}
                                    </span>
                                )}
                            </button>
                        ))}
                    </motion.div>

                    {/* Documents Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {isLoading ? (
                            // Loading Skeletons
                            <>
                                <DocumentCardSkeleton />
                                <DocumentCardSkeleton />
                                <DocumentCardSkeleton />
                                <DocumentCardSkeleton />
                            </>
                        ) : isError ? (
                            // Error State
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-2 bg-red-50 border border-red-200 rounded-xl p-8 text-center"
                            >
                                <div className="text-5xl mb-4">😔</div>
                                <p className="text-red-600 font-semibold mb-2">Failed to load documents</p>
                                <p className="text-red-500 text-sm">Please refresh the page or try again later.</p>
                            </motion.div>
                        ) : filteredResources.length === 0 ? (
                            // Empty State
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="col-span-2 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-12 text-center"
                            >
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p className="text-gray-600 font-semibold mb-2">
                                    No documents in this category
                                </p>
                                <p className="text-gray-500 text-sm mb-4">
                                    Try selecting a different category or check back later.
                                </p>
                                <button
                                    onClick={() => setSelectedCategory('ALL')}
                                    className="text-wiria-blue-dark font-semibold hover:text-wiria-yellow transition-colors"
                                >
                                    View all documents →
                                </button>
                            </motion.div>
                        ) : (
                            // Document Cards with animation
                            <AnimatePresence mode="popLayout">
                                {filteredResources.map((doc, index) => (
                                    <DocumentCard
                                        key={doc.id}
                                        document={doc}
                                        index={index}
                                        onClick={() => handleOpenModal(doc)}
                                    />
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </section>

            {/* Document Modal */}
            <DocumentModal
                document={selectedDocument}
                isOpen={!!selectedDocument}
                onClose={handleCloseModal}
            />
        </>
    );
}
