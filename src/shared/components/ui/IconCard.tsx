/**
 * IconCard Component
 * Reusable card with icon for features/benefits grids

 */

import type { ReactNode } from 'react';

import { motion } from 'framer-motion';

/**
 * Props for the IconCard component.
 */
interface IconCardProps {
  /** The icon to display. */
  icon: ReactNode;
  /** The title of the card. */
  title: string;
  /** The description text. */
  description: string;
  /** Background color class for the icon container. Defaults to 'bg-wiria-yellow'. */
  iconBgColor?: string;
  /** Animation delay in seconds. Defaults to 0. */
  delay?: number;
  /** Optional class name for the card container. */
  className?: string;
}

/**
 * A reusable card component displaying an icon, title, and description.
 * Features fade-in animation.
 */
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
