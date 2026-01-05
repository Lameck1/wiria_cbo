/**
 * Back to Top Button - Floating scroll-to-top component
 * Shows after scrolling down, smooth animation, accessible
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function BackToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            // Show button when page is scrolled more than 400px
            if (window.scrollY > 400) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 group"
                    aria-label="Scroll to top"
                >
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-wiria-yellow rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300" />

                    {/* Button */}
                    <div className="relative flex items-center justify-center w-12 h-12 bg-wiria-blue-dark hover:bg-wiria-yellow text-white hover:text-wiria-blue-dark rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                        <svg
                            className="w-5 h-5 transform group-hover:-translate-y-0.5 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M5 15l7-7 7 7"
                            />
                        </svg>
                    </div>
                </motion.button>
            )}
        </AnimatePresence>
    );
}
