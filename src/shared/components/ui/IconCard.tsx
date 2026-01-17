/**
 * IconCard Component
 * Reusable card with icon for features/benefits grids

 */

import type { ReactNode } from 'react';

import { motion } from 'framer-motion';

interface IconCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  iconBgColor?: string;
  delay?: number;
  className?: string;
}

export function IconCard({
  icon,
  title,
  description,
  iconBgColor = 'bg-wiria-yellow',
  delay = 0,
  className = '',
}: IconCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={`text-center ${className}`}
    >
      <div
        className={`${iconBgColor} mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full`}
      >
        {icon}
      </div>
      <h4 className="mb-2 text-xl font-bold text-wiria-blue-dark">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}
