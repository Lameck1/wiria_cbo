/**
 * Card Component
 * Reusable card container
 */

import type { ReactNode } from 'react';

import { cn } from '@/shared/utils/helpers';

/**
 * Props for the Card component.
 */
export interface CardProps {
  /** The content of the card. */
  children: ReactNode;
  /** Optional class name for custom styling. */
  className?: string;
  /** If true, adds hover effects (scale and shadow). */
  hover?: boolean;
}

/**
 * A container component with shadow and rounded corners.
 */
export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg bg-white shadow-md',
        hover && 'transition-transform duration-300 hover:scale-105 hover:shadow-xl',
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Header section for the Card component.
 */
export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('border-b border-gray-100 p-6', className)}>{children}</div>;
}

/**
 * Body section for the Card component.
 */
export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('p-6', className)}>{children}</div>;
}


