/**
 * Update Modal Component
 * Displays full update content with scroll indicator
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
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
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button - beautifully designed with proper spacing */}
                        <button
                            onClick={onClose}
                            className="absolute z-50 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-xl hover:bg-white hover:scale-110 hover:shadow-2xl transition-all duration-200 border border-gray-100 group"
                            style={{ top: '16px', right: '16px' }}
                            aria-label="Close modal"
                        >
                            <svg
                                className="w-5 h-5 text-gray-500 group-hover:text-gray-800 group-hover:rotate-90 transition-all duration-200"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Image */}
                        <div className="relative">
                            <img
                                src={update.imageUrl}
                                alt={update.title}
                                className="w-full h-64 object-cover"
                            />
                        </div>

                        {/* Content */}
                        <div className="relative">
                            <div
                                ref={modalBodyRef}
                                onScroll={handleScroll}
                                className="p-8 overflow-y-auto max-h-[calc(90vh-16rem)] scroll-smooth"
                            >
                                <p className="text-sm text-gray-500 mb-2">
                                    {update.category}
                                    {formattedDate && ` - ${formattedDate}`}
                                </p>
                                <h3 className="text-3xl font-bold text-wiria-blue-dark mb-4">{update.title}</h3>
                                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {update.fullContent}
                                </div>
                            </div>

                            {/* Scroll indicator */}
                            {showScrollIndicator && (
                                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white to-transparent pointer-events-none">
                                    <div className="flex justify-center items-end h-full pb-4">
                                        <svg
                                            className="w-6 h-6 text-wiria-blue-dark animate-bounce"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
