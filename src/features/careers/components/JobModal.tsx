/**
 * JobModal Component

 * Styled consistently with OpportunityModal
 */

import { Modal } from '@/shared/components/ui/Modal';

import { JobModalContent } from './JobModalContent';
import { JOB_TYPE_LABELS } from '../constants/careersData';
import { Job } from '../hooks/useCareers';

interface JobModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

export function JobModal({ job, isOpen, onClose, onApply }: JobModalProps) {
  if (!isOpen || !job) return null;

  const deadlineDate = new Date(job.deadline);
  const isExpired = deadlineDate < new Date();
  const typeLabel = JOB_TYPE_LABELS[job.employmentType] || job.employmentType;

  // Career modals use blue/purple gradient
  const headerBgClass = 'bg-gradient-to-r from-wiria-blue-dark to-indigo-700 text-white';

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" noPadding>
      {/* Header - Styled like OpportunityModal */}
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
              id="career-modal-pattern"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="10" cy="10" r="2" fill="currentColor" />
            </pattern>
            <rect x="0" y="0" width="100" height="100" fill="url(#career-modal-pattern)" />
          </svg>
        </div>

        {/* Type Badge */}
        <span className="relative z-10 mb-3 inline-block rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm">
          {typeLabel} Position
        </span>

        {/* Title */}
        <h2 className="relative z-10 mb-2 pr-12 text-2xl font-bold md:text-3xl">{job.title}</h2>

        {/* Location */}
        <p className="relative z-10 flex items-center gap-2 text-lg text-white/80">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {job.location}
        </p>
      </div>

      {/* Body */}
      <div className="p-8">
        <JobModalContent job={job} />
      </div>

      {/* Footer - Styled like OpportunityModal */}
      <div className="flex flex-col items-center justify-between gap-4 border-t p-8 sm:flex-row">
        <p className="text-sm text-gray-600">
          {isExpired ? 'This position has closed.' : 'Interested in this role? Apply now!'}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="rounded-full border border-gray-300 px-6 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            Close
          </button>
          <button
            onClick={onApply}
            disabled={isExpired}
            className={`transform rounded-full px-8 py-2.5 font-bold shadow-md transition-all ${
              isExpired
                ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                : 'bg-wiria-yellow text-white hover:scale-105 hover:bg-amber-500 hover:shadow-lg'
            }`}
          >
            {isExpired ? 'Applications Closed' : 'Apply Now'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
