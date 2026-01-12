/**
 * OpportunityCard Component ()

 */

import { motion } from 'framer-motion';
import { Opportunity } from '../hooks/useOpportunities';
import { getDaysUntilDeadline, getUrgencyLevel, isNewOpportunity } from '../utils/deadlineUtils';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onViewDetails: () => void;
}

function UrgencyBadge({ daysRemaining }: { daysRemaining: number }) {
  const urgency = getUrgencyLevel(daysRemaining);

  if (urgency === 'urgent') {
    return (
      <span className="inline-flex animate-pulse items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
        🔴 {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left
      </span>
    );
  }

  if (urgency === 'soon') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
        🟠 {daysRemaining} days left
      </span>
    );
  }

  return null;
}

function NewBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
      ✨ New
    </span>
  );
}

export function OpportunityCard({ opportunity, onViewDetails }: OpportunityCardProps) {
  const typeLabel = opportunity.type === 'VOLUNTEER' ? 'Volunteer' : 'Internship';
  const typeBadgeClass =
    opportunity.type === 'VOLUNTEER'
      ? 'bg-green-100 text-green-700 border border-green-200'
      : 'bg-blue-100 text-blue-700 border border-blue-200';

  const daysRemaining = getDaysUntilDeadline(opportunity.deadline);
  const isNew = isNewOpportunity(opportunity.createdAt);

  // Extract skills from requirements (first 3)
  const skillTags = opportunity.requirements?.slice(0, 3) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }}
      className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-6 transition-all"
      onClick={onViewDetails}
    >
      {/* Top Badges Row */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${typeBadgeClass}`}>
          {opportunity.type === 'VOLUNTEER' ? '🤝' : '🎓'} {typeLabel}
        </span>
        {isNew && <NewBadge />}
        {daysRemaining !== null && daysRemaining <= 7 && (
          <UrgencyBadge daysRemaining={daysRemaining} />
        )}
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          {/* Title */}
          <h3 className="mb-2 text-xl font-bold text-wiria-blue-dark transition-colors group-hover:text-blue-700">
            {opportunity.title}
          </h3>

          {/* Meta Info */}
          <div className="mb-3 flex flex-wrap gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              {opportunity.location}
            </span>
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {opportunity.duration}
            </span>
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              {opportunity.category}
            </span>
          </div>

          {/* Summary */}
          <p className="mb-4 line-clamp-2 text-gray-600">{opportunity.summary}</p>

          {/* Skills Tags */}
          {skillTags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {skillTags.map((skill, idx) => (
                <span
                  key={idx}
                  className="max-w-[150px] truncate rounded bg-gray-100 px-2 py-1 text-xs text-gray-600"
                  title={skill}
                >
                  {skill.length > 25 ? skill.substring(0, 25) + '...' : skill}
                </span>
              ))}
              {opportunity.requirements && opportunity.requirements.length > 3 && (
                <span className="px-2 py-1 text-xs text-gray-400">
                  +{opportunity.requirements.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Deadline */}
          {opportunity.deadline !== 'Ongoing' && daysRemaining !== null && daysRemaining > 7 && (
            <p className="text-sm text-gray-500">
              📅 Deadline:{' '}
              {new Date(opportunity.deadline).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          )}
        </div>

        {/* View Details Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails();
          }}
          className="flex items-center gap-2 whitespace-nowrap rounded-full bg-wiria-blue-dark px-6 py-2.5 font-semibold text-white transition-all hover:bg-wiria-yellow hover:text-wiria-blue-dark hover:shadow-lg group-hover:bg-wiria-yellow group-hover:text-wiria-blue-dark"
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
    </motion.div>
  );
}
