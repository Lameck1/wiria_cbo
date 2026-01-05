/**
 * JobModal Component
 * Single responsibility: Display job details in a modal
 * Styled consistently with OpportunityModal
 */

import { ModalOverlay, ModalHeader, ModalBody, ModalFooter } from '@/shared/components/modal';
import { Job } from '../hooks/useCareers';
import { JobModalContent } from './JobModalContent';
import { JOB_TYPE_LABELS } from '../constants/careersData';

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
        <ModalOverlay isOpen={isOpen} onClose={onClose} maxWidth="3xl">
            {/* Header - Styled like OpportunityModal */}
            <ModalHeader onClose={onClose} className={headerBgClass}>
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-10 overflow-hidden rounded-t-2xl">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <pattern id="career-modal-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                            <circle cx="10" cy="10" r="2" fill="currentColor" />
                        </pattern>
                        <rect x="0" y="0" width="100" height="100" fill="url(#career-modal-pattern)" />
                    </svg>
                </div>

                {/* Type Badge */}
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-3 backdrop-blur-sm relative z-10">
                    {typeLabel} Position
                </span>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-bold mb-2 pr-12 relative z-10">
                    {job.title}
                </h2>

                {/* Location */}
                <p className="text-white/80 text-lg relative z-10 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                </p>
            </ModalHeader>

            {/* Body */}
            <ModalBody>
                <JobModalContent job={job} />
            </ModalBody>

            {/* Footer - Styled like OpportunityModal */}
            <ModalFooter className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-600">
                    {isExpired ? 'This position has closed.' : 'Interested in this role? Apply now!'}
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-100 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={onApply}
                        disabled={isExpired}
                        className={`px-8 py-2.5 font-bold rounded-full shadow-md transition-all transform ${isExpired
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-wiria-yellow hover:bg-amber-500 text-white hover:shadow-lg hover:scale-105'
                            }`}
                    >
                        {isExpired ? 'Applications Closed' : 'Apply Now'}
                    </button>
                </div>
            </ModalFooter>
        </ModalOverlay>
    );
}
