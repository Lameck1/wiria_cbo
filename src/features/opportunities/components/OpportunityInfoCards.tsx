/**
 * OpportunityInfoCards Component
 * Single responsibility: Display quick info cards for an opportunity
 */

import { formatDate } from '@/shared/utils/dateUtils';

interface OpportunityInfoCardsProps {
    location: string;
    duration: string;
    deadline: string;
    status: string;
    colorScheme: 'green' | 'blue';
}

const COLOR_SCHEMES = {
    green: { bg: 'bg-green-50', border: 'border-green-200' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200' },
} as const;

interface InfoCardProps {
    emoji: string;
    label: string;
    value: string;
    colorScheme: 'green' | 'blue';
    valueClassName?: string;
}

function InfoCard({ emoji, label, value, colorScheme, valueClassName = '' }: InfoCardProps) {
    const colors = COLOR_SCHEMES[colorScheme];
    return (
        <div className={`${colors.bg} ${colors.border} border rounded-xl p-4 text-center`}>
            <div className="text-2xl mb-1">{emoji}</div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
            <p className={`text-sm font-semibold text-gray-800 ${valueClassName}`}>{value}</p>
        </div>
    );
}

export function OpportunityInfoCards({
    location,
    duration,
    deadline,
    status,
    colorScheme,
}: OpportunityInfoCardsProps) {
    const statusColor = status === 'ACTIVE' ? 'text-green-600' : 'text-gray-600';

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <InfoCard
                emoji="📍"
                label="Location"
                value={location}
                colorScheme={colorScheme}
            />
            <InfoCard
                emoji="⏱️"
                label="Duration"
                value={duration}
                colorScheme={colorScheme}
            />
            <InfoCard
                emoji="📅"
                label="Deadline"
                value={formatDate(deadline)}
                colorScheme={colorScheme}
            />
            <InfoCard
                emoji="🏷️"
                label="Status"
                value={status}
                colorScheme={colorScheme}
                valueClassName={statusColor}
            />
        </div>
    );
}
