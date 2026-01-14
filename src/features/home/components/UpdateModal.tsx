/**
 * Update Modal Component
 * Displays full update content with scroll indicator
 */

import { useEffect, useRef, useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import { ImageCarousel } from '@/shared/components/ImageCarousel';

import { Update } from '../hooks/useUpdates';


interface UpdateModalProps {
  update: Update | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UpdateModal({ update, isOpen, onClose }: UpdateModalProps) {
  const modalBodyRef = useRef<HTMLDivElement>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      checkScrollIndicator();
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const checkScrollIndicator = () => {
    const container = modalBodyRef.current;
    if (!container) return;

    setTimeout(() => {
      const hasScroll = container.scrollHeight > container.clientHeight;
      const isAtBottom =
        container.scrollHeight - container.scrollTop <= container.clientHeight + 10;
      setShowScrollIndicator(hasScroll && !isAtBottom);
    }, 100);
  };

  const handleScroll = () => {
    const container = modalBodyRef.current;
    if (!container) return;

    const hasScroll = container.scrollHeight > container.clientHeight;
    const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 10;
    setShowScrollIndicator(hasScroll && !isAtBottom);
  };

  if (!update) return null;

  const dateString = update.publishedAt ?? update.date;
  const formattedDate = dateString
    ? new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button - Fixed at top-right */}
            <button
              onClick={onClose}
              className="group absolute z-50 rounded-full border border-gray-100 bg-white/80 p-2.5 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white"
              style={{ top: '12px', right: '12px' }}
              aria-label="Close modal"
            >
              <svg
                className="h-5 w-5 text-gray-500 group-hover:text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Scrollable Content Container */}
            <div
              ref={modalBodyRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto scroll-smooth"
            >
              {/* Article Header (Centered & Spaced) */}
              <div className="mx-auto max-w-2xl px-6 pb-8 pt-16 text-center md:px-10">
                <div className="mb-4 flex items-center justify-center gap-3">
                  <span className="rounded-full bg-wiria-blue-dark/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-wiria-blue-dark">
                    {update.category}
                  </span>
                  {formattedDate && (
                    <span className="text-xs font-medium text-gray-400">{formattedDate}</span>
                  )}
                </div>

                <h3 className="mb-6 text-2xl font-extrabold leading-tight text-wiria-blue-dark md:text-3xl">
                  {update.title}
                </h3>

                {update.excerpt && (
                  <p className="border-b border-t border-gray-100 py-6 text-lg font-medium italic leading-relaxed text-gray-500">
                    "{update.excerpt}"
                  </p>
                )}
              </div>

              {/* Embedded Media */}
              <div className="mb-8 px-4 md:px-6">
                <div className="overflow-hidden rounded-xl border border-gray-100 shadow-lg">
                  <ImageCarousel
                    images={update.images || [update.imageUrl]}
                    title={update.title}
                    aspectRatio="aspect-[16/9]"
                  />
                </div>
              </div>

              {/* Main Article Body */}
              <div className="mx-auto max-w-2xl px-8 pb-16 md:px-10">
                <div className="prose prose-blue max-w-none whitespace-pre-wrap text-base leading-relaxed text-gray-700 md:text-lg">
                  {update.fullContent}
                </div>
              </div>
            </div>

            {/* Minimal Scroll indicator overlay */}
            {showScrollIndicator && (
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex h-12 items-end justify-center bg-gradient-to-t from-white via-white/40 to-transparent pb-3">
                <motion.div
                  animate={{ y: [0, 4, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                >
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </motion.div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
