/**
 * JobModalContent Component

 * Follows pattern from OpportunityModalContent
 */

import { formatDate } from '@/shared/utils/dateUtils';

import { JOB_TYPE_LABELS } from '../constants/careersData';
import { Job } from '../hooks/useCareers';

interface JobModalContentProps {
  job: Job;
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

const StarIcon = () => (
  <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
);

export function JobModalContent({ job }: JobModalContentProps) {
  const typeLabel = JOB_TYPE_LABELS[job.employmentType] ?? job.employmentType;
  const deadlineDate = new Date(job.deadline);
  const isExpired = deadlineDate < new Date();

  return (
    <>
      {/* Quick Info Cards */}
      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center">
          <div className="mb-1 text-2xl">💼</div>
          <p className="mb-1 text-xs uppercase tracking-wide text-gray-500">Type</p>
          <p className="text-sm font-semibold text-gray-800">{typeLabel}</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center">
          <div className="mb-1 text-2xl">📍</div>
          <p className="mb-1 text-xs uppercase tracking-wide text-gray-500">Location</p>
          <p className="text-sm font-semibold text-gray-800">{job.location}</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center">
          <div className="mb-1 text-2xl">📅</div>
          <p className="mb-1 text-xs uppercase tracking-wide text-gray-500">Deadline</p>
          <p className={`text-sm font-semibold ${isExpired ? 'text-red-600' : 'text-gray-800'}`}>
            {formatDate(job.deadline)}
          </p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center">
          <div className="mb-1 text-2xl">💰</div>
          <p className="mb-1 text-xs uppercase tracking-wide text-gray-500">Salary</p>
          <p className="text-sm font-semibold text-gray-800">{job.salary ?? 'Competitive'}</p>
        </div>
      </div>

      {/* Summary */}
      {job.summary && (
        <div className="mb-6">
          <div className="rounded-r-lg border-l-4 border-wiria-yellow bg-gradient-to-r from-wiria-yellow/10 to-amber-50 p-4">
            <p className="font-medium italic text-gray-700">"{job.summary}"</p>
          </div>
        </div>
      )}

      {/* About Section */}
      <section className="mb-6">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-wiria-blue-dark">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-wiria-blue-dark/10">
            <InfoIcon />
          </span>
          About This Position
        </h3>
        <p className="leading-relaxed text-gray-700">{job.description}</p>
      </section>

      {/* Responsibilities */}
      {job.responsibilities && job.responsibilities.length > 0 && (
        <section className="mb-6">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-wiria-blue-dark">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
              <ClipboardIcon />
            </span>
            Key Responsibilities
          </h3>
          <ul className="space-y-2">
            {job.responsibilities.map((item, index) => (
              <li key={index} className="flex items-start text-gray-700">
                <span className="mr-3 mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-600">
                  {index + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Requirements */}
      {job.requirements && job.requirements.length > 0 && (
        <section className="mb-6">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-wiria-blue-dark">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
              <ShieldIcon />
            </span>
            Requirements
          </h3>
          <ul className="space-y-2">
            {job.requirements.map((item, index) => (
              <li key={index} className="flex items-start text-gray-700">
                <span className="mr-3 flex-shrink-0 text-amber-500">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Desirable */}
      {job.desirable && job.desirable.length > 0 && (
        <section className="mb-6">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-wiria-blue-dark">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
              <StarIcon />
            </span>
            Nice to Have
          </h3>
          <div className="flex flex-wrap gap-2">
            {job.desirable.map((item, index) => (
              <span
                key={index}
                className="rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-sm text-green-700"
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Meta Info */}
      <div className="mt-6 border-t border-gray-100 pt-4 text-xs text-gray-400">
        <p>Posted: {new Date(job.createdAt).toLocaleDateString()}</p>
      </div>
    </>
  );
}
