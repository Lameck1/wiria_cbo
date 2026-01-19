/**
 * Card Component
 * Reusable card container
 */

import type { ReactNode } from 'react';

import { cn } from '@/shared/utils/helpers';

export interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

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

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('border-b border-gray-100 p-6', className)}>{children}</div>;
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('p-6', className)}>{children}</div>;
}


