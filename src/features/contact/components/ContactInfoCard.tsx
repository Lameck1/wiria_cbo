/**
 * ContactInfoCard Component
 * Glassmorphism styled card for displaying contact information with icon

 */

import { ReactNode } from 'react';

import { motion } from 'framer-motion';

interface ContactInfoCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  href?: string;
  delay?: number;
}

export function ContactInfoCard({ icon, title, children, href, delay = 0 }: ContactInfoCardProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.02, x: 5 }}
      className={`group -mx-4 mt-6 flex items-start rounded-xl border border-white/40 bg-white/60 p-4 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-lg ${href ? 'active:scale-98 cursor-pointer' : ''} `}
    >
      <motion.div
        whileHover={{ rotate: 10, scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 400 }}
        className="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-wiria-yellow/20 to-wiria-yellow/10 shadow-inner transition-all group-hover:from-wiria-yellow/30 group-hover:to-wiria-yellow/20"
      >
        {icon}
      </motion.div>
      <div className="min-w-0 flex-1">
        <h4 className="text-lg font-bold text-wiria-blue-dark transition-colors group-hover:text-wiria-yellow">
          {title}
        </h4>
        <div className="mt-1 text-gray-600 transition-colors group-hover:text-gray-700">
          {children}
        </div>
      </div>
      {href && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileHover={{ opacity: 1, x: 0 }}
          className="hidden items-center text-wiria-yellow opacity-0 transition-opacity group-hover:opacity-100 lg:flex"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );

  // Wrap in link for click-to-contact on mobile
  if (href) {
    return (
      <a href={href} className="block no-underline">
        {content}
      </a>
    );
  }

  return content;
}
