/**
 * TenderCard Component
 * Mobile card view for tender listings with countdown timer and status badges
 */

import { motion } from 'framer-motion';
import type { Tender } from '../hooks/useTenders';

interface TenderCardProps {
  tender: Tender;
  onClick: () => void;
  index?: number;
}

/**
 * Calculate countdown from now to deadline
 */
function getCountdown(deadline: string): {
  days: number;
  hours: number;
  isExpired: boolean;
  isUrgent: boolean;
} {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diff = deadlineDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, isExpired: true, isUrgent: false };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const isUrgent = days <= 7;

  return { days, hours, isExpired: false, isUrgent };
}

/**
 * Get status badge styling based on tender status and deadline
 */
function getStatusBadge(status: string, isUrgent: boolean, isExpired: boolean) {
  if (isExpired || status === 'CLOSED') {
    return { text: 'Closed', bgClass: 'bg-gray-100 text-gray-600', dotClass: 'bg-gray-400' };
  }
  if (isUrgent) {
    return {
      text: 'Closing Soon',
      bgClass: 'bg-red-100 text-red-600',
      dotClass: 'bg-red-500 animate-pulse',
    };
  }
  if (status === 'OPEN') {
    return { text: 'Open', bgClass: 'bg-green-100 text-green-600', dotClass: 'bg-green-500' };
  }
  return { text: status, bgClass: 'bg-gray-100 text-gray-600', dotClass: 'bg-gray-400' };
}

export function TenderCard({ tender, onClick, index = 0 }: TenderCardProps) {
  const { days, hours, isExpired, isUrgent } = getCountdown(tender.deadline);
  const statusBadge = getStatusBadge(tender.status, isUrgent, isExpired);
  const deadlineDate = new Date(tender.deadline);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="rounded-xl border border-gray-100 bg-white p-5 shadow-md transition-shadow hover:shadow-xl"
    >
      {/* Header with Ref Number and Status */}
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded bg-wiria-blue-dark/10 px-2 py-1 font-mono text-xs text-wiria-blue-dark">
          {tender.refNo}
        </span>
        {/* Status Badge */}
        <span
          className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs font-semibold ${statusBadge.bgClass}`}
        >
          <span className={`h-2 w-2 rounded-full ${statusBadge.dotClass}`} />
          {statusBadge.text}
        </span>
      </div>

      {/* Title */}
      <h3 className="mb-2 line-clamp-2 text-lg font-bold text-wiria-blue-dark">{tender.title}</h3>

      {/* Category & Value */}
      <div className="mb-3 flex flex-wrap gap-2 text-sm text-gray-500">
        <span className="rounded bg-gray-100 px-2 py-1">{tender.category}</span>
        <span className="font-semibold text-wiria-blue-dark">{tender.estimatedValue}</span>
      </div>

      {/* Countdown Timer */}
      {!isExpired && (
        <div
          className={`mb-3 flex items-center gap-2 rounded-lg p-2 ${isUrgent ? 'bg-red-50' : 'bg-blue-50'}`}
        >
          <svg
            className={`h-5 w-5 ${isUrgent ? 'text-red-500' : 'text-blue-500'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className={`text-sm font-semibold ${isUrgent ? 'text-red-600' : 'text-blue-600'}`}>
            {days > 0 ? `${days}d ${hours}h remaining` : `${hours} hours remaining`}
          </span>
        </div>
      )}

      {/* Deadline */}
      <p className="mb-3 text-sm text-gray-600">
        <span className="font-semibold">Deadline:</span>{' '}
        {deadlineDate.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })}
      </p>

      {/* Document Availability Badge */}
      <div className="mb-4">
        {tender.downloadUrl ? (
          <span className="inline-flex items-center gap-1.5 rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Document Ready
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-700">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            No Document Yet
          </span>
        )}
      </div>

      {/* View Details Button */}
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isExpired}
        className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-semibold transition-colors ${
          isExpired
            ? 'cursor-not-allowed bg-gray-200 text-gray-500'
            : 'bg-wiria-blue-dark text-white hover:bg-wiria-yellow'
        }`}
      >
        {isExpired ? 'Tender Closed' : 'View Details'}
        {!isExpired && (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </motion.button>
    </motion.div>
  );
}

// Export countdown helper for reuse in table view
// eslint-disable-next-line react-refresh/only-export-components
export { getCountdown, getStatusBadge };
