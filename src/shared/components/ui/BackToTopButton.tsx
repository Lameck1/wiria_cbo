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
          className="group fixed bottom-8 right-8 z-50"
          aria-label="Scroll to top"
        >
          {/* Glow effect on hover */}
          <div className="absolute inset-0 rounded-full bg-wiria-yellow opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-50" />

          {/* Button */}
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-wiria-blue-dark text-white shadow-lg transition-all duration-300 hover:bg-wiria-yellow hover:text-wiria-blue-dark hover:shadow-xl group-hover:scale-110">
            <svg
              className="h-5 w-5 transform transition-transform group-hover:-translate-y-0.5"
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
