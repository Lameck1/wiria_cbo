/**
 * OpportunityModalContent Component


 */

import { OpportunityDetailSection } from './OpportunityDetailSection';
import { OpportunityInfoCards } from './OpportunityInfoCards';
import { Opportunity } from '../hooks/useOpportunities';

interface OpportunityModalContentProps {
  opportunity: Opportunity;
}

// Icons as pure components
const InfoIcon = () => (
  <svg
    className="h-4 w-4 text-wiria-blue-dark"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ClipboardIcon = () => (
  <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
    />
  </svg>
);

const ShieldIcon = () => (
  <svg className="h-4 w-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

const GiftIcon = () => (
  <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export function OpportunityModalContent({ opportunity }: OpportunityModalContentProps) {
  const colorScheme = opportunity.type === 'VOLUNTEER' ? 'green' : 'blue';

  return (
    <>
      {/* Info Cards */}
      <OpportunityInfoCards
        location={opportunity.location}
        duration={opportunity.duration}
        deadline={opportunity.deadline}
        status={opportunity.status}
        colorScheme={colorScheme}
      />

      {/* Summary Quote */}
      {opportunity.summary && (
        <div className="mb-6">
          <div className="rounded-r-lg border-l-4 border-wiria-yellow bg-gradient-to-r from-wiria-yellow/10 to-amber-50 p-4">
            <p className="font-medium italic text-gray-700">"{opportunity.summary}"</p>
          </div>
        </div>
      )}

      {/* About Section */}
      <section className="mb-6">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-wiria-blue-dark">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-wiria-blue-dark/10">
            <InfoIcon />
          </span>
          About This Opportunity
        </h3>
        <p className="leading-relaxed text-gray-700">{opportunity.description}</p>
      </section>

      {/* Responsibilities */}
      <OpportunityDetailSection
        title="Key Responsibilities"
        items={opportunity.responsibilities || []}
        icon={<ClipboardIcon />}
        iconBgColor="bg-purple-100"
        listStyle="numbered"
        listItemColor="text-purple-600"
      />

      {/* Requirements */}
      <OpportunityDetailSection
        title="Requirements"
        items={opportunity.requirements || []}
        icon={<ShieldIcon />}
        iconBgColor="bg-amber-100"
        listStyle="check"
        listItemColor="text-amber-500"
      />

      {/* Benefits */}
      <OpportunityDetailSection
        title="What You'll Get"
        items={opportunity.benefits || []}
        icon={<GiftIcon />}
        iconBgColor="bg-green-100"
        listStyle="gift"
      />

      {/* Meta Info */}
      <div className="mt-6 border-t border-gray-100 pt-4 text-xs text-gray-400">
        <p>Posted: {new Date(opportunity.createdAt).toLocaleDateString()}</p>
        <p>Last Updated: {new Date(opportunity.updatedAt).toLocaleDateString()}</p>
      </div>
    </>
  );
}
