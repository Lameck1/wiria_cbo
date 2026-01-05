/**
 * ActiveTendersSection Component
 * Displays tenders with card view on mobile and table view on desktop
 * Includes countdown timers, status badges, loading skeletons, and improved empty state
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTenders, Tender } from '../hooks/useTenders';
import { TenderCard, getCountdown, getStatusBadge } from './TenderCard';
import { TenderModal } from './TenderModal';
import { TenderCardSkeleton, TenderTableRowSkeleton } from './TenderCardSkeleton';

export function ActiveTendersSection() {
    const { data: tenders = [], isLoading, isError } = useTenders();
    const [selectedTender, setSelectedTender] = useState<Tender | null>(null);

    // Filter to only show open tenders
    const openTenders = tenders.filter(t => t.status === 'OPEN');

    const handleOpenModal = useCallback((tender: Tender) => {
        setSelectedTender(tender);
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedTender(null);
    }, []);

    return (
        <>
            <section id="tenders" className="py-16 bg-gray-50 scroll-mt-20">
                <div className="container mx-auto px-4 lg:px-6 max-w-5xl">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-10"
                    >
                        <h2 className="text-2xl md:text-3xl font-bold text-wiria-blue-dark mb-4">Active Tenders</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-wiria-yellow to-wiria-green-light mx-auto rounded-full" />
                    </motion.div>

                    {isLoading ? (
                        <>
                            {/* Mobile Skeletons */}
                            <div className="lg:hidden space-y-4">
                                <TenderCardSkeleton />
                                <TenderCardSkeleton />
                            </div>
                            {/* Desktop Skeleton */}
                            <div className="hidden lg:block overflow-x-auto shadow-md rounded-lg">
                                <table className="min-w-full bg-white">
                                    <thead className="bg-wiria-blue-dark text-white">
                                        <tr>
                                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Ref No.</th>
                                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Description</th>
                                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Deadline</th>
                                            <th className="text-center py-3 px-4 uppercase font-semibold text-sm">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <TenderTableRowSkeleton />
                                        <TenderTableRowSkeleton />
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : isError ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-red-50 border border-red-200 rounded-xl p-8 text-center"
                        >
                            <div className="text-5xl mb-4">😔</div>
                            <p className="text-red-600 font-semibold mb-2">Failed to load tenders</p>
                            <p className="text-red-500 text-sm">Please refresh the page or try again later.</p>
                        </motion.div>
                    ) : openTenders.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-12 text-center"
                        >
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <p className="text-gray-600 font-semibold mb-2">No Active Tenders</p>
                            <p className="text-gray-500 text-sm mb-4">
                                There are currently no open tenders. New opportunities are posted regularly.
                            </p>
                            <a
                                href="mailto:mwiriacbo@gmail.com?subject=Tender%20Inquiry"
                                className="inline-flex items-center gap-2 text-wiria-blue-dark font-semibold hover:text-wiria-yellow transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Get notified about new tenders
                            </a>
                        </motion.div>
                    ) : (
                        <>
                            {/* Mobile/Tablet Card View */}
                            <div className="lg:hidden space-y-4">
                                <AnimatePresence mode="popLayout">
                                    {openTenders.map((tender, index) => (
                                        <TenderCard
                                            key={tender.id}
                                            tender={tender}
                                            index={index}
                                            onClick={() => handleOpenModal(tender)}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Desktop Table View */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="hidden lg:block overflow-x-auto shadow-md rounded-lg"
                            >
                                <table className="min-w-full bg-white">
                                    <thead className="bg-wiria-blue-dark text-white">
                                        <tr>
                                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Ref No.</th>
                                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Description</th>
                                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Deadline</th>
                                            <th className="text-center py-3 px-4 uppercase font-semibold text-sm">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-700 divide-y divide-gray-100">
                                        {openTenders.map((tender) => {
                                            const { days, hours, isUrgent, isExpired } = getCountdown(tender.deadline);
                                            const statusBadge = getStatusBadge(tender.status, isUrgent, isExpired);
                                            const deadlineDate = new Date(tender.deadline);

                                            return (
                                                <tr key={tender.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="py-4 px-4">
                                                        <span className="font-mono text-sm text-wiria-blue-dark">{tender.refNo}</span>
                                                        <div className="mt-1">
                                                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded ${statusBadge.bgClass}`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dotClass}`} />
                                                                {statusBadge.text}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <p className="font-semibold text-wiria-blue-dark">{tender.title}</p>
                                                        <p className="text-sm text-gray-500 line-clamp-1">{tender.description}</p>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <p className="font-semibold text-gray-700">
                                                            {deadlineDate.toLocaleDateString('en-GB', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            })}
                                                        </p>
                                                        {!isExpired && (
                                                            <div className={`flex items-center gap-1 mt-1 text-xs font-semibold ${isUrgent ? 'text-red-600' : 'text-blue-600'}`}>
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                {days > 0 ? `${days}d ${hours}h` : `${hours}h`}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-4 text-center">
                                                        <button
                                                            onClick={() => handleOpenModal(tender)}
                                                            className="bg-wiria-blue-dark text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-wiria-yellow transition-colors"
                                                        >
                                                            View Details
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </motion.div>
                        </>
                    )}
                </div>
            </section>

            {/* Tender Modal */}
            <TenderModal
                tender={selectedTender}
                isOpen={!!selectedTender}
                onClose={handleCloseModal}
            />
        </>
    );
}
