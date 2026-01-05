/**
 * Recent Updates Section - Exact HTML Match
 * Displays recent updates with pagination and modal
 * Initially hidden, only shows if updates exist
 */

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useUpdates, Update } from '../hooks/useUpdates';
import { UpdateModal } from './UpdateModal';

export function RecentUpdatesSection() {
    const { data: allUpdates = [], isLoading, isError } = useUpdates(20);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUpdate, setSelectedUpdate] = useState<Update | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const updatesPerPage = 4;
    const totalPages = Math.ceil(allUpdates.length / updatesPerPage);
    const startIndex = (currentPage - 1) * updatesPerPage;
    const endIndex = Math.min(startIndex + updatesPerPage, allUpdates.length);
    const pageUpdates = allUpdates.slice(startIndex, endIndex);

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

    const handlePrevPage = () => {
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
            <section id="recent-updates-section" className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 lg:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-wiria-blue-dark mb-4">Recent Updates</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-wiria-yellow to-wiria-green-light mx-auto rounded-full mb-6" />
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Stay informed about our latest activities and achievements
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-wiria-blue-dark" />
                            <p className="mt-4 text-gray-600">Loading updates...</p>
                        </div>
                    ) : isError ? (
                        <div className="text-center py-12">
                            <p className="text-red-600">Failed to load updates.</p>
                        </div>
                    ) : (
                        <>
                            <div id="updates-container" className="grid md:grid-cols-2 gap-8 mb-10">
                                {pageUpdates.map((update: Update, index: number) => {
                                    const dateStr = update.publishedAt || update.date;
                                    const formattedDate = dateStr
                                        ? new Date(dateStr).toLocaleDateString('en-US', {
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
                                            className="group bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100"
                                        >
                                            <img src={update.imageUrl} alt={update.title} className="w-full aspect-[16/9] object-cover" />
                                            <div className="p-6">
                                                <p className="text-sm text-gray-500 mb-2">
                                                    {update.category}
                                                    {formattedDate && ` - ${formattedDate}`}
                                                </p>
                                                <h4 className="font-bold text-lg mb-2 text-wiria-blue-dark">{update.title}</h4>
                                                <p className="text-gray-600 mb-4">{update.excerpt}</p>
                                                <button
                                                    onClick={() => handleReadMore(update)}
                                                    className="font-semibold text-wiria-yellow hover:text-wiria-blue-dark transition-colors duration-200 flex items-center gap-2"
                                                >
                                                    <span>Read More</span>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Pagination Controls - Exact from original */}
                            {totalPages > 1 && (
                                <div id="pagination-controls" className="flex justify-center items-center gap-4">
                                    <button
                                        id="prev-page"
                                        onClick={handlePrevPage}
                                        disabled={currentPage === 1}
                                        className="px-5 py-2.5 bg-wiria-blue-dark text-white rounded-full hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                                        aria-label="Previous page"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        <span className="hidden sm:inline">Previous</span>
                                    </button>

                                    <div
                                        id="page-info"
                                        className="text-gray-700 font-semibold px-4 py-2 bg-white rounded-full shadow-sm"
                                    >
                                        Page <span id="current-page" className="text-wiria-blue-dark">{currentPage}</span> of{' '}
                                        <span id="total-pages" className="text-wiria-blue-dark">{totalPages}</span>
                                    </div>

                                    <button
                                        id="next-page"
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                        className="px-5 py-2.5 bg-wiria-blue-dark text-white rounded-full hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                                        aria-label="Next page"
                                    >
                                        <span className="hidden sm:inline">Next</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            <UpdateModal update={selectedUpdate} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}
