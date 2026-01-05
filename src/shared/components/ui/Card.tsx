/**
 * Card Component
 * Reusable card container
 */

import { ReactNode } from 'react';
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
                'bg-white rounded-lg shadow-md overflow-hidden',
                hover && 'transition-transform duration-300 hover:scale-105 hover:shadow-xl',
                className
            )}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
    return <div className={cn('p-6 border-b border-gray-100', className)}>{children}</div>;
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
    return <div className={cn('p-6', className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: ReactNode; className?: string }) {
    return <div className={cn('p-6 border-t border-gray-100', className)}>{children}</div>;
}
