/**
 * WhyJoinSection Component

 * Uses shared IconCard component
 */

import { SectionHeader } from '@/shared/components/sections/SectionHeader';
import { IconCard } from '@/shared/components/ui/IconCard';

import { WHY_JOIN_REASONS } from '../constants/careersData';

// Icons mapping
const ICONS: Record<string, React.ReactNode> = {
  book: (
    <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  ),
  users: (
    <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  ),
  smile: (
    <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
};

export function WhyJoinSection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 lg:px-6">
        <SectionHeader title="Why Join WIRIA CBO?" />

        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {WHY_JOIN_REASONS.map((reason, index) => (
            <IconCard
              key={reason.title}
              icon={ICONS[reason.icon]}
              title={reason.title}
              description={reason.description}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
