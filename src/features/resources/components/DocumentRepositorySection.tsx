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
    return resources.filter((doc) => doc.category === selectedCategory);
  }, [resources, selectedCategory]);

  // Get category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: resources.length };
    resources.forEach((doc) => {
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
      <section id="documents" className="scroll-mt-20 py-16">
        <div className="container mx-auto max-w-5xl px-4 lg:px-6">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-wiria-blue-dark">Document Repository</h2>
            <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-wiria-yellow to-wiria-green-light" />
          </motion.div>

          <p className="mx-auto mb-8 max-w-3xl text-center text-gray-600">
            In our commitment to transparency and accountability, we make our key organizational
            documents available to the public.
          </p>

          {/* Category Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 flex flex-wrap justify-center gap-2"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  selectedCategory === cat.key
                    ? 'bg-wiria-blue-dark text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.label}
                {(categoryCounts[cat.key] ?? 0) > 0 && (
                  <span
                    className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                      selectedCategory === cat.key ? 'bg-white/20' : 'bg-gray-300'
                    }`}
                  >
                    {categoryCounts[cat.key] ?? 0}
                  </span>
                )}
              </button>
            ))}
          </motion.div>

          {/* Documents Grid */}
          <div className="grid gap-6 md:grid-cols-2">
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
                className="col-span-2 rounded-xl border border-red-200 bg-red-50 p-8 text-center"
              >
                <div className="mb-4 text-5xl">😔</div>
                <p className="mb-2 font-semibold text-red-600">Failed to load documents</p>
                <p className="text-sm text-red-500">Please refresh the page or try again later.</p>
              </motion.div>
            ) : filteredResources.length === 0 ? (
              // Empty State
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="col-span-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <svg
                    className="h-8 w-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="mb-2 font-semibold text-gray-600">No documents in this category</p>
                <p className="mb-4 text-sm text-gray-500">
                  Try selecting a different category or check back later.
                </p>
                <button
                  onClick={() => setSelectedCategory('ALL')}
                  className="font-semibold text-wiria-blue-dark transition-colors hover:text-wiria-yellow"
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
