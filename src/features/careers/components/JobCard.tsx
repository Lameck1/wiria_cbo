/**
 * JobCard Component

 */

import { motion } from 'framer-motion';

import { JOB_TYPE_LABELS } from '../constants/careersData';
import { Job } from '../hooks/useCareers';

interface JobCardProps {
  job: Job;
  onClick: () => void;
}

// Get days until deadline
function getDaysRemaining(deadline: string): number {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diff = deadlineDate.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Get urgency color based on days remaining
function getDeadlineColor(daysRemaining: number): string {
  if (daysRemaining <= 3) return 'text-red-600 bg-red-50';
  if (daysRemaining <= 7) return 'text-orange-600 bg-orange-50';
  return 'text-green-600 bg-green-50';
}

export function JobCard({ job, onClick }: JobCardProps) {
  const typeLabel = JOB_TYPE_LABELS[job.employmentType] || job.employmentType;
  const deadlineDate = new Date(job.deadline);
  const isExpired = deadlineDate < new Date();
  const daysRemaining = getDaysRemaining(job.deadline);

  // Check if job was posted within last 7 days
  const postedDate = new Date(job.createdAt);
  const daysSincePosted = Math.floor((Date.now() - postedDate.getTime()) / (1000 * 60 * 60 * 24));
  const isNew = daysSincePosted <= 7;

  // Extract department from title or use default
  const getDepartment = (title: string): string => {
    if (title.toLowerCase().includes('health')) return 'Health';
    if (title.toLowerCase().includes('finance')) return 'Finance';
    if (title.toLowerCase().includes('admin')) return 'Admin';
    if (title.toLowerCase().includes('program')) return 'Programs';
    if (title.toLowerCase().includes('monitor')) return 'M&E';
    return 'General';
  };

  const department = getDepartment(job.title);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-gray-200 bg-white p-6 transition-all hover:border-wiria-blue-dark/30"
    >
      {/* Department Badge - Top Corner */}
      <div className="absolute right-0 top-0">
        <div className="rounded-bl-xl bg-gradient-to-l from-wiria-blue-dark to-blue-700 px-4 py-1 text-xs font-semibold text-white">
          {department}
        </div>
      </div>

      {/* Header */}
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1 pr-20">
          {/* Status Badges */}
          <div className="mb-3 flex flex-wrap gap-2">
            {isNew && (
              <span className="inline-flex animate-pulse items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                ✨ New
              </span>
            )}
            {!isExpired && daysRemaining <= 7 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                🔥 Closing Soon
              </span>
            )}
          </div>

          {/* Job Title */}
          <h3 className="mb-3 text-2xl font-bold text-wiria-blue-dark transition-colors group-hover:text-wiria-yellow">
            {job.title}
          </h3>

          {/* Meta Info Row */}
          <div className="mb-4 flex flex-wrap gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-100 px-3 py-1.5 font-medium text-blue-800">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {typeLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 text-gray-600">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
            </span>
            {job.salary && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 font-semibold text-green-700">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {job.salary}
              </span>
            )}
          </div>

          {/* Deadline Countdown */}
          <div
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${isExpired ? 'bg-gray-100 text-gray-500' : getDeadlineColor(daysRemaining)}`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {isExpired
              ? 'Applications Closed'
              : daysRemaining === 0
                ? 'Closes Today!'
                : daysRemaining === 1
                  ? '1 day remaining'
                  : `${daysRemaining} days remaining`}
          </div>
        </div>

        {/* CTA Button */}
        <button
          className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-6 py-3 font-bold shadow-md transition-all ${
            isExpired
              ? 'cursor-not-allowed bg-gray-200 text-gray-500'
              : 'bg-gradient-to-r from-wiria-blue-dark to-blue-700 text-white hover:shadow-lg group-hover:from-wiria-yellow group-hover:to-amber-500 group-hover:text-wiria-blue-dark'
          }`}
        >
          View Details
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Summary */}
      <p className="mb-4 line-clamp-2 leading-relaxed text-gray-600">{job.summary}</p>

      {/* Requirements Preview Tags */}
      {job.requirements && job.requirements.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
          <span className="mr-1 text-xs font-medium text-gray-400">Key requirements:</span>
          {job.requirements.slice(0, 3).map((request, index) => (
            <span
              key={index}
              className="rounded-lg border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
              title={request}
            >
              {request.length > 25 ? request.slice(0, 25) + '...' : request}
            </span>
          ))}
          {job.requirements.length > 3 && (
            <span className="px-2 py-1 text-xs font-semibold text-wiria-blue-dark">
              +{job.requirements.length - 3} more
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}
