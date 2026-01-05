/**
 * EmptyStateView Component
 * Single responsibility: Display enhanced empty state when no opportunities available
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
            className="bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-2xl p-12 text-center"
        >
            {/* Illustration */}
            <div className="w-24 h-24 mx-auto mb-6 bg-wiria-yellow/20 rounded-full flex items-center justify-center">
                <span className="text-5xl">🔍</span>
            </div>

            {/* Message */}
            <h3 className="text-2xl font-bold text-wiria-blue-dark mb-3">
                {hasFilters ? 'No Matching Opportunities' : 'No Openings Right Now'}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {hasFilters
                    ? 'Try adjusting your filters or check back later for new opportunities that match your criteria.'
                    : "We don't have any open positions at the moment, but we're always looking for passionate individuals to join our mission."
                }
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {hasFilters && onClearFilters && (
                    <button
                        onClick={onClearFilters}
                        className="bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-full hover:bg-gray-50 transition-colors"
                    >
                        Clear Filters
                    </button>
                )}
                <Link
                    to="/contact"
                    className="bg-wiria-blue-dark hover:bg-wiria-yellow hover:text-wiria-blue-dark text-white font-semibold py-3 px-6 rounded-full transition-colors inline-flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Get Notified
                </Link>
            </div>

            {/* Newsletter Signup */}
            <div className="mt-10 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-4">Subscribe to be notified when new opportunities open up</p>
                <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-wiria-yellow focus:border-transparent"
                    />
                    <button
                        type="submit"
                        className="bg-wiria-yellow hover:bg-amber-500 text-white font-semibold py-3 px-6 rounded-full transition-colors whitespace-nowrap"
                    >
                        Subscribe
                    </button>
                </form>
            </div>
        </motion.div>
    );
}
