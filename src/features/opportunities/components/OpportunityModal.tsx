/**
 * OpportunityModal Component
 * Single responsibility: Compose and orchestrate the opportunity details modal
 * Uses composition pattern with reusable modal and content components
 */

import { ModalOverlay, ModalHeader, ModalBody, ModalFooter } from '@/shared/components/modal';
import { Opportunity } from '../hooks/useOpportunities';
import { OpportunityModalContent } from './OpportunityModalContent';

interface OpportunityModalProps {
    opportunity: Opportunity | null;
    isOpen: boolean;
    onClose: () => void;
    onApply?: () => void;
}

export function OpportunityModal({
    opportunity,
    isOpen,
    onClose,
    onApply,
}: OpportunityModalProps) {
    if (!opportunity) return null;

    const typeLabel = opportunity.type === 'VOLUNTEER' ? 'Volunteer' : 'Internship';
    const headerBgClass = opportunity.type === 'VOLUNTEER'
        ? 'bg-green-500 text-white'
        : 'bg-blue-500 text-white';

    return (
        <ModalOverlay isOpen={isOpen} onClose={onClose} maxWidth="3xl">
            {/* Header */}
            <ModalHeader onClose={onClose} className={headerBgClass}>
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-10 overflow-hidden rounded-t-2xl">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <pattern id="modal-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                            <circle cx="10" cy="10" r="2" fill="currentColor" />
                        </pattern>
                        <rect x="0" y="0" width="100" height="100" fill="url(#modal-pattern)" />
                    </svg>
                </div>

                {/* Type Badge */}
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-3 backdrop-blur-sm relative z-10">
                    {typeLabel} Opportunity
                </span>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-bold mb-2 pr-12 relative z-10">
                    {opportunity.title}
                </h2>

                {/* Category */}
                <p className="text-white/80 text-lg relative z-10">{opportunity.category}</p>
            </ModalHeader>

            {/* Body */}
            <ModalBody>
                <OpportunityModalContent opportunity={opportunity} />
            </ModalBody>

            {/* Footer */}
            <ModalFooter className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-600">
                    Interested in this opportunity? Apply now!
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
                        className="px-8 py-2.5 bg-wiria-yellow hover:bg-amber-500 text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                    >
                        Apply Now
                    </button>
                </div>
            </ModalFooter>
        </ModalOverlay>
    );
}
