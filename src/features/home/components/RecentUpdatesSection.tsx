/**
 * Recent Updates Section
 * Displays recent updates with pagination and modal
 * Initially hidden, only shows if updates exist
 */

import { useState, useEffect } from 'react';

import { motion } from 'framer-motion';

import { ImageCarousel } from '@/shared/components/ImageCarousel';

import { UpdateModal } from './UpdateModal';
import { useUpdates, Update } from '../hooks/useUpdates';

interface RecentUpdatesListProps {
  updates: Update[];
  onReadMore: (update: Update) => void;
}

function RecentUpdatesList({ updates, onReadMore }: RecentUpdatesListProps) {
  return (
    <div id="updates-container" className="mb-10 grid gap-8 md:grid-cols-2">
      {updates.map((update, index) => {
        const dateString = update.publishedAt ?? update.date;
        const formattedDate = dateString
          ? new Date(dateString).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : '';

        return (
          <motion.div
            key={update.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <ImageCarousel images={update.images ?? [update.imageUrl]} title={update.title} />
            <div className="p-6">
              <p className="mb-2 text-sm text-gray-500">
                {update.category}
                {formattedDate && ` - ${formattedDate}`}
              </p>
              <h4 className="mb-2 text-lg font-bold text-wiria-blue-dark">{update.title}</h4>
              <p className="mb-4 text-gray-600">{update.excerpt}</p>
              <button
                onClick={() => onReadMore(update)}
                className="flex items-center gap-2 font-semibold text-wiria-yellow transition-colors duration-200 hover:text-wiria-blue-dark"
              >
                <span>Read More</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function RecentUpdatesLoading() {
  return (
    <div className="py-12 text-center">
      <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-wiria-blue-dark" />
      <p className="mt-4 text-gray-600">Loading updates...</p>
    </div>
  );
}

function RecentUpdatesError() {
  return (
    <div className="py-12 text-center">
      <p className="text-red-600">Failed to load updates.</p>
    </div>
  );
}

interface RecentUpdatesPaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

function RecentUpdatesPagination({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}: RecentUpdatesPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div id="pagination-controls" className="flex items-center justify-center gap-4">
      <button
        id="prev-page"
        onClick={onPrevious}
        disabled={currentPage === 1}
        className="flex items-center gap-2 rounded-full bg-wiria-blue-dark px-5 py-2.5 text-white transition-all hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Previous page"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span className="hidden sm:inline">Previous</span>
      </button>

      <div
        id="page-info"
        className="rounded-full bg-white px-4 py-2 font-semibold text-gray-700 shadow-sm"
      >
        Page{' '}
        <span id="current-page" className="text-wiria-blue-dark">
          {currentPage}
        </span>{' '}
        of{' '}
        <span id="total-pages" className="text-wiria-blue-dark">
          {totalPages}
        </span>
      </div>

      <button
        id="next-page"
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 rounded-full bg-wiria-blue-dark px-5 py-2.5 text-white transition-all hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Next page"
      >
        <span className="hidden sm:inline">Next</span>
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}


export function RecentUpdatesSection() {
  const { data: allUpdates = [], isLoading, isError } = useUpdates(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUpdate, setSelectedUpdate] = useState<Update | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const updatesPerPage = 4;
  const displayUpdates = [...allUpdates].reverse();
  const totalPages = Math.ceil(displayUpdates.length / updatesPerPage);
  const startIndex = (currentPage - 1) * updatesPerPage;
  const endIndex = Math.min(startIndex + updatesPerPage, displayUpdates.length);
  const pageUpdates = displayUpdates.slice(startIndex, endIndex);

  // Show section only if updates exist - matching original HTML behavior
  useEffect(() => {
    if (!isLoading && allUpdates.length > 0) {
      setIsVisible(true);
    }
  }, [isLoading, allUpdates.length]);

  // Don't render if loading or no updates
  if (!isVisible) {
    return null;
  }

  const handleReadMore = (update: Update) => {
    setSelectedUpdate(update);
    setIsModalOpen(true);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      const section = document.getElementById('recent-updates-section');
      if (section) {
        const yOffset = -100;
        const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      const section = document.getElementById('recent-updates-section');
      if (section) {
        const yOffset = -100;
        const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <section id="recent-updates-section" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-wiria-blue-dark md:text-4xl">
              Recent Updates
            </h2>
            <div className="mx-auto mb-6 h-1 w-24 rounded-full bg-gradient-to-r from-wiria-yellow to-wiria-green-light" />
            <p className="mx-auto max-w-2xl text-gray-600">
              Stay informed about our latest activities and achievements
            </p>
          </div>

          {isLoading ? (
            <RecentUpdatesLoading />
          ) : isError ? (
            <RecentUpdatesError />
          ) : (
            <>
              <RecentUpdatesList updates={pageUpdates} onReadMore={handleReadMore} />
              <RecentUpdatesPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevious={handlePreviousPage}
                onNext={handleNextPage}
              />
            </>
          )}
        </div>
      </section>

      <UpdateModal
        update={selectedUpdate}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
