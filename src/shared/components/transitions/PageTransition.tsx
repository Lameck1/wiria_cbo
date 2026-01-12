/**
 * Smooth Page Transition Wrapper
 * Prevents white flashes during route changes
 */

import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0.98 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0.98 }}
      transition={{ duration: 0.15, ease: 'easeInOut' }}
      style={{ minHeight: '100vh' }}
    >
      {children}
    </motion.div>
  );
}
