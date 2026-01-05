/**
 * JobModalContent Component
 * Single responsibility: Render job details content
 * Follows pattern from OpportunityModalContent
 */

import { Job } from '../hooks/useCareers';
import { JOB_TYPE_LABELS } from '../constants/careersData';
import { formatDate } from '@/shared/utils/dateUtils';

interface JobModalContentProps {
    job: Job;
}

// Icons as pure components
const InfoIcon = () => (
    <svg className="w-4 h-4 text-wiria-blue-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ClipboardIcon = () => (
    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
);

const ShieldIcon = () => (
    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const StarIcon = () => (
    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
);

export function JobModalContent({ job }: JobModalContentProps) {
    const typeLabel = JOB_TYPE_LABELS[job.employmentType] || job.employmentType;
    const deadlineDate = new Date(job.deadline);
    const isExpired = deadlineDate < new Date();

    return (
        <>
            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-1">💼</div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Type</p>
                    <p className="text-sm font-semibold text-gray-800">{typeLabel}</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-1">📍</div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Location</p>
                    <p className="text-sm font-semibold text-gray-800">{job.location}</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-1">📅</div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Deadline</p>
                    <p className={`text-sm font-semibold ${isExpired ? 'text-red-600' : 'text-gray-800'}`}>
                        {formatDate(job.deadline)}
                    </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-1">💰</div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Salary</p>
                    <p className="text-sm font-semibold text-gray-800">{job.salary || 'Competitive'}</p>
                </div>
            </div>

            {/* Summary */}
            {job.summary && (
                <div className="mb-6">
                    <div className="bg-gradient-to-r from-wiria-yellow/10 to-amber-50 border-l-4 border-wiria-yellow rounded-r-lg p-4">
                        <p className="text-gray-700 font-medium italic">"{job.summary}"</p>
                    </div>
                </div>
            )}

            {/* About Section */}
            <section className="mb-6">
                <h3 className="flex items-center gap-2 text-lg font-bold text-wiria-blue-dark mb-3">
                    <span className="w-8 h-8 rounded-lg bg-wiria-blue-dark/10 flex items-center justify-center">
                        <InfoIcon />
                    </span>
                    About This Position
                </h3>
                <p className="text-gray-700 leading-relaxed">{job.description}</p>
            </section>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
                <section className="mb-6">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-wiria-blue-dark mb-3">
                        <span className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                            <ClipboardIcon />
                        </span>
                        Key Responsibilities
                    </h3>
                    <ul className="space-y-2">
                        {job.responsibilities.map((item, i) => (
                            <li key={i} className="flex items-start text-gray-700">
                                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 mt-0.5">
                                    {i + 1}
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
                    <h3 className="flex items-center gap-2 text-lg font-bold text-wiria-blue-dark mb-3">
                        <span className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                            <ShieldIcon />
                        </span>
                        Requirements
                    </h3>
                    <ul className="space-y-2">
                        {job.requirements.map((item, i) => (
                            <li key={i} className="flex items-start text-gray-700">
                                <span className="text-amber-500 mr-3 flex-shrink-0">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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
                    <h3 className="flex items-center gap-2 text-lg font-bold text-wiria-blue-dark mb-3">
                        <span className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                            <StarIcon />
                        </span>
                        Nice to Have
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {job.desirable.map((item, i) => (
                            <span key={i} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm border border-green-200">
                                {item}
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {/* Meta Info */}
            <div className="text-xs text-gray-400 mt-6 pt-4 border-t border-gray-100">
                <p>Posted: {new Date(job.createdAt).toLocaleDateString()}</p>
            </div>
        </>
    );
}
