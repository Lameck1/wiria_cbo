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
function getCountdown(deadline: string): { days: number; hours: number; isExpired: boolean; isUrgent: boolean } {
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
        return { text: 'Closing Soon', bgClass: 'bg-red-100 text-red-600', dotClass: 'bg-red-500 animate-pulse' };
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
            className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-xl transition-shadow"
        >
            {/* Header with Ref Number and Status */}
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-wiria-blue-dark bg-wiria-blue-dark/10 px-2 py-1 rounded">
                    {tender.refNo}
                </span>
                {/* Status Badge */}
                <span className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded ${statusBadge.bgClass}`}>
                    <span className={`w-2 h-2 rounded-full ${statusBadge.dotClass}`} />
                    {statusBadge.text}
                </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-wiria-blue-dark mb-2 line-clamp-2">
                {tender.title}
            </h3>

            {/* Category & Value */}
            <div className="flex flex-wrap gap-2 mb-3 text-sm text-gray-500">
                <span className="bg-gray-100 px-2 py-1 rounded">{tender.category}</span>
                <span className="font-semibold text-wiria-blue-dark">{tender.estimatedValue}</span>
            </div>

            {/* Countdown Timer */}
            {!isExpired && (
                <div className={`flex items-center gap-2 mb-3 p-2 rounded-lg ${isUrgent ? 'bg-red-50' : 'bg-blue-50'}`}>
                    <svg className={`w-5 h-5 ${isUrgent ? 'text-red-500' : 'text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className={`text-sm font-semibold ${isUrgent ? 'text-red-600' : 'text-blue-600'}`}>
                        {days > 0 ? `${days}d ${hours}h remaining` : `${hours} hours remaining`}
                    </span>
                </div>
            )}

            {/* Deadline */}
            <p className="text-sm text-gray-600 mb-3">
                <span className="font-semibold">Deadline:</span>{' '}
                {deadlineDate.toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                })}
            </p>

            {/* Document Availability Badge */}
            <div className="mb-4">
                {tender.downloadUrl ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded bg-green-100 text-green-700">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Document Ready
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded bg-yellow-100 text-yellow-700">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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
                className={`w-full font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${isExpired
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-wiria-blue-dark text-white hover:bg-wiria-yellow'
                    }`}
            >
                {isExpired ? 'Tender Closed' : 'View Details'}
                {!isExpired && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
