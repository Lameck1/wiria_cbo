/**
 * OpportunityModal Component

 * Uses composition pattern with reusable modal and content components
 */

import { Modal } from '@/shared/components/ui/Modal';

import { OpportunityModalContent } from './OpportunityModalContent';
import { Opportunity } from '../hooks/useOpportunities';

interface OpportunityModalProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
  onApply?: () => void;
}

export function OpportunityModal({ opportunity, isOpen, onClose, onApply }: OpportunityModalProps) {
  if (!opportunity) return null;

  const typeLabel = opportunity.type === 'VOLUNTEER' ? 'Volunteer' : 'Internship';
  const headerBgClass =
    opportunity.type === 'VOLUNTEER' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white';

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" noPadding>
      {/* Header */}
      <div className={`relative flex-shrink-0 p-8 ${headerBgClass}`}>
        <button
          onClick={onClose}
          className="absolute right-8 top-8 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          aria-label="Close modal"
        >
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Decorative Pattern */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern
              id="modal-pattern"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="10" cy="10" r="2" fill="currentColor" />
            </pattern>
            <rect x="0" y="0" width="100" height="100" fill="url(#modal-pattern)" />
          </svg>
        </div>

        {/* Type Badge */}
        <span className="relative z-10 mb-3 inline-block rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm">
          {typeLabel} Opportunity
        </span>

        {/* Title */}
        <h2 className="relative z-10 mb-2 pr-12 text-2xl font-bold md:text-3xl">
          {opportunity.title}
        </h2>

        {/* Category */}
        <p className="relative z-10 text-lg text-white/80">{opportunity.category}</p>
      </div>

      {/* Body */}
      <div className="p-8">
        <OpportunityModalContent opportunity={opportunity} />
      </div>

      {/* Footer */}
      <div className="flex flex-col items-center justify-between gap-4 border-t p-8 sm:flex-row">
        <p className="text-sm text-gray-600">Interested in this opportunity? Apply now!</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="rounded-full border border-gray-300 px-6 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            Close
          </button>
          <button
            onClick={onApply}
            className="transform rounded-full bg-wiria-yellow px-8 py-2.5 font-bold text-white shadow-md transition-all hover:scale-105 hover:bg-amber-500 hover:shadow-lg"
          >
            Apply Now
          </button>
        </div>
      </div>
    </Modal>
  );
}
