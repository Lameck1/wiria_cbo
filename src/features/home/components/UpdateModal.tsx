/**
 * Update Modal Component
 * Displays full update content with scroll indicator
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Update } from '../hooks/useUpdates';
import { ImageCarousel } from '@/shared/components/ImageCarousel';

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
            const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 10;
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

    const dateStr = update.publishedAt || update.date;
    const formattedDate = dateStr
        ? new Date(dateStr).toLocaleDateString('en-US', {
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
                    className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button - Fixed at top-right */}
                        <button
                            onClick={onClose}
                            className="absolute z-50 bg-white/80 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 border border-gray-100 group"
                            style={{ top: '12px', right: '12px' }}
                            aria-label="Close modal"
                        >
                            <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Scrollable Content Container */}
                        <div
                            ref={modalBodyRef}
                            onScroll={handleScroll}
                            className="flex-1 overflow-y-auto scroll-smooth"
                        >
                            {/* Article Header (Centered & Spaced) */}
                            <div className="pt-16 pb-8 px-6 md:px-10 max-w-2xl mx-auto text-center">
                                <div className="flex items-center justify-center gap-3 mb-4">
                                    <span className="px-2.5 py-0.5 bg-wiria-blue-dark/5 text-wiria-blue-dark text-[10px] font-bold rounded-full uppercase tracking-[0.1em]">
                                        {update.category}
                                    </span>
                                    {formattedDate && (
                                        <span className="text-gray-400 text-xs font-medium">
                                            {formattedDate}
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-2xl md:text-3xl font-extrabold text-wiria-blue-dark mb-6 leading-tight">
                                    {update.title}
                                </h3>

                                {update.excerpt && (
                                    <p className="text-lg text-gray-500 font-medium leading-relaxed italic border-t border-b border-gray-100 py-6">
                                        "{update.excerpt}"
                                    </p>
                                )}
                            </div>

                            {/* Embedded Media */}
                            <div className="px-4 md:px-6 mb-8">
                                <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100">
                                    <ImageCarousel
                                        images={update.images || [update.imageUrl]}
                                        title={update.title}
                                        aspectRatio="aspect-[16/9]"
                                    />
                                </div>
                            </div>

                            {/* Main Article Body */}
                            <div className="px-8 md:px-10 pb-16 max-w-2xl mx-auto">
                                <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap text-base md:text-lg">
                                    {update.fullContent}
                                </div>
                            </div>
                        </div>

                        {/* Minimal Scroll indicator overlay */}
                        {showScrollIndicator && (
                            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white via-white/40 to-transparent pointer-events-none flex justify-center items-end pb-3">
                                <motion.div animate={{ y: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
