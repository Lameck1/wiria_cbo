/**
 * ReportStatusLookup Component

 */

import { useState, FormEvent } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import { useSafeguardingReport } from '../hooks/useSafeguardingReport';

// status configuration with icons
const STATUS_CONFIG: Record<string, { bg: string; text: string; icon: string; label: string }> = {
  PENDING: {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    icon: '⏳',
    label: 'Pending Review',
  },
  UNDER_REVIEW: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    icon: '👁️',
    label: 'Under Review',
  },
  INVESTIGATING: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    icon: '🔍',
    label: 'Investigating',
  },
  RESOLVED: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    icon: '✓',
    label: 'Resolved',
  },
  CLOSED: {
    bg: 'bg-gray-200',
    text: 'text-gray-800',
    icon: '🔒',
    label: 'Closed',
  },
};

export function ReportStatusLookup() {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [email, setEmail] = useState('');

  const { lookupStatus, isLookingUp, lookupResult, lookupError, resetLookup } =
    useSafeguardingReport();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    void lookupStatus(referenceNumber, email || undefined);
  };

  const handleReset = () => {
    resetLookup();
    setReferenceNumber('');
    setEmail('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const statusConfig = lookupResult ? STATUS_CONFIG[lookupResult.status] : null;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
      <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-wiria-blue-dark">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
        Check Report Status
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="lookupReference" className="mb-1 block text-sm font-medium text-gray-700">
            Reference Number
          </label>
          <input
            type="text"
            id="lookupReference"
            value={referenceNumber}
            onChange={(event) => setReferenceNumber(event.target.value)}
            required
            disabled={isLookingUp}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-wiria-blue-dark focus:ring-2 focus:ring-wiria-blue-dark disabled:bg-gray-50"
            placeholder="SGR-2025-XXXXXX"
          />
        </div>
        <div>
          <label htmlFor="lookupEmail" className="mb-1 block text-sm font-medium text-gray-700">
            Email (if provided)
          </label>
          <input
            type="email"
            id="lookupEmail"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isLookingUp}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-wiria-blue-dark focus:ring-2 focus:ring-wiria-blue-dark disabled:bg-gray-50"
            placeholder="Optional - for verification"
          />
        </div>
        <button
          type="submit"
          disabled={isLookingUp || !referenceNumber}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-wiria-blue-dark px-4 py-3 font-semibold text-white transition-all hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLookingUp ? (
            <>
              <motion.svg
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </motion.svg>
              Checking...
            </>
          ) : (
            'Check Status'
          )}
        </button>
      </form>

      {/* Status Result with Badge */}
      <AnimatePresence>
        {lookupResult && statusConfig && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mt-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-4"
          >
            <p className="mb-2 text-sm text-gray-600">Status:</p>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 ${statusConfig.bg} ${statusConfig.text} font-bold`}
            >
              <span className="text-lg">{statusConfig.icon}</span>
              <span>{statusConfig.label}</span>
            </motion.div>
            <div className="mt-3 space-y-1 border-t border-gray-200 pt-3 text-sm text-gray-500">
              <p className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 4h10M5 11h14M5 15h14M5 19h14"
                  />
                </svg>
                Submitted: {formatDate(lookupResult.createdAt)}
              </p>
              {lookupResult.updatedAt !== lookupResult.createdAt && (
                <p className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Updated: {formatDate(lookupResult.updatedAt)}
                </p>
              )}
            </div>
            <button
              onClick={handleReset}
              className="mt-4 flex items-center gap-1 text-sm font-medium text-wiria-blue-dark transition-colors hover:text-wiria-yellow"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Check Another Report
            </button>
          </motion.div>
        )}

        {lookupError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4"
          >
            <p className="flex items-center gap-2 text-sm text-red-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {lookupError}
            </p>
            <button
              onClick={handleReset}
              className="mt-2 text-sm font-medium text-red-700 hover:text-red-800"
            >
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
