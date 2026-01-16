/**
 * EmptyStateView Component

 */

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface EmptyStateViewProps {
  hasFilters?: boolean;
  onClearFilters?: () => void;
}

export function EmptyStateView({ hasFilters = false, onClearFilters }: EmptyStateViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50 p-12 text-center"
    >
      {/* Illustration */}
      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-wiria-yellow/20">
        <span className="text-5xl">🔍</span>
      </div>

      {/* Message */}
      <h3 className="mb-3 text-2xl font-bold text-wiria-blue-dark">
        {hasFilters ? 'No Matching Opportunities' : 'No Openings Right Now'}
      </h3>
      <p className="mx-auto mb-8 max-w-md text-gray-600">
        {hasFilters
          ? 'Try adjusting your filters or check back later for new opportunities that match your criteria.'
          : "We don't have any open positions at the moment, but we're always looking for passionate individuals to join our mission."}
      </p>

      {/* Actions */}
      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        {hasFilters && onClearFilters && (
          <button
            onClick={onClearFilters}
            className="rounded-full border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Clear Filters
          </button>
        )}
        <Link
          to="/contact"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-wiria-blue-dark px-6 py-3 font-semibold text-white transition-colors hover:bg-wiria-yellow hover:text-wiria-blue-dark"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          Get Notified
        </Link>
      </div>

      {/* Newsletter Signup */}
      <div className="mt-10 border-t border-gray-200 pt-8">
        <p className="mb-4 text-sm text-gray-500">
          Subscribe to be notified when new opportunities open up
        </p>
        <form
          className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
          onSubmit={(event) => event.preventDefault()}
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 rounded-full border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-wiria-yellow"
          />
          <button
            type="submit"
            className="whitespace-nowrap rounded-full bg-wiria-yellow px-6 py-3 font-semibold text-white transition-colors hover:bg-amber-500"
          >
            Subscribe
          </button>
        </form>
      </div>
    </motion.div>
  );
}
