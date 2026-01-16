/**
 * StatCard Component
 * Reusable card for displaying dashboard statistics.
 */

import { ReactNode } from 'react';

interface StatCardProps {
    /** Main label displayed above the number */
    title: string;
    /** Primary statistic value */
    value: number | string;
    /** Secondary info displayed below the value */
    subtitle?: string;
    /** Tailwind border color class (e.g., 'border-blue-600') */
    borderColor?: string;
    /** Click handler for card navigation */
    onClick?: () => void;
    /** Optional icon to display */
    icon?: ReactNode;
}

export function StatCard({
    title,
    value,
    subtitle,
    borderColor = 'border-blue-600',
    onClick,
    icon,
}: StatCardProps) {
    const isClickable = !!onClick;

    return (
        <div
            className={`rounded-2xl border-t-4 ${borderColor} bg-white p-6 shadow-lg transition-shadow ${isClickable ? 'cursor-pointer hover:shadow-xl' : ''
                }`}
            onClick={onClick}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onKeyDown={(event) => {
                if (isClickable && (event.key === 'Enter' || event.key === ' ')) {
                    event.preventDefault();
                    onClick();
                }
            }}
            aria-label={isClickable ? `View ${title}` : undefined}
        >
            {icon && <div className="mb-2 text-2xl">{icon}</div>}
            <p className="mb-1 text-xs font-bold uppercase text-gray-500">{title}</p>
            <div className="text-3xl font-bold text-gray-900">{value}</div>
            {subtitle && <p className="mt-1 text-xs text-gray-400">{subtitle}</p>}
        </div>
    );
}
