/**
 * SectionHeader Component
 * Reusable section header with title and gradient underline

 */

import { motion } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  badge,
  centered = true,
  className = '',
}: SectionHeaderProps) {
  const alignClass = centered ? 'text-center' : 'text-left';
  const underlineClass = centered ? 'mx-auto' : '';

  return (
    <div className={`mb-12 ${alignClass} ${className}`}>
      {/* Optional Badge */}
      {badge && (
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4 inline-block rounded-full bg-wiria-yellow/20 px-4 py-1.5 text-sm font-medium text-wiria-blue-dark"
        >
          {badge}
        </motion.span>
      )}

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-4 text-3xl font-bold text-wiria-blue-dark md:text-4xl"
      >
        {title}
      </motion.h2>

      {/* Gradient Underline */}
      <div
        className={`mb-6 h-1 w-24 rounded-full bg-gradient-to-r from-wiria-yellow to-wiria-green-light ${underlineClass}`}
      />

      {/* Optional Subtitle */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-lg text-gray-600"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
