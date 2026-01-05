/**
 * ApplicationFormModal Component
 * Single responsibility: Compose and orchestrate the application form modal
 * Uses composition pattern with reusable modal components and custom hook
 */

import { useEffect } from 'react';
import { ModalOverlay, ModalHeader, ModalBody, ModalFooter } from '@/shared/components/modal';
import { Opportunity } from '../hooks/useOpportunities';
import { useApplicationForm } from '../hooks/useApplicationForm';
import { ApplicationFormFields } from './ApplicationFormFields';
import { ApplicationSuccessView } from './ApplicationSuccessView';
import { ApplicationErrorView } from './ApplicationErrorView';

interface ApplicationFormModalProps {
    opportunity: Opportunity | null;
    isOpen: boolean;
    onClose: () => void;
    onBack: () => void;
}

export function ApplicationFormModal({
    opportunity,
    isOpen,
    onClose,
    onBack,
}: ApplicationFormModalProps) {
    const {
        formData,
        submitStatus,
        errorMessage,
        handleInputChange,
        handleSubmit,
        resetForm,
        retrySubmit,
    } = useApplicationForm();

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            resetForm();
        }
    }, [isOpen, resetForm]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (opportunity) {
            await handleSubmit(opportunity.id);
        }
    };

    if (!opportunity) return null;

    const isIdle = submitStatus === 'idle';
    const isSubmitting = submitStatus === 'submitting';
    const isSuccess = submitStatus === 'success';
    const isError = submitStatus === 'error';

    return (
        <ModalOverlay isOpen={isOpen} onClose={onClose} maxWidth="2xl">
            {/* Header */}
            <ModalHeader
                onClose={onClose}
                className="bg-gradient-to-r from-wiria-blue-dark to-blue-700 text-white"
            >
                <div>
                    <h2 className="text-xl font-bold">Apply for Position</h2>
                    <p className="text-white/80 text-sm mt-1">{opportunity.title}</p>
                </div>
            </ModalHeader>

            {/* Body */}
            <ModalBody>
                {isSuccess && (
                    <ApplicationSuccessView
                        opportunityTitle={opportunity.title}
                        email={formData.email}
                        onClose={onClose}
                    />
                )}

                {isError && (
                    <ApplicationErrorView
                        errorMessage={errorMessage}
                        onRetry={retrySubmit}
                        onClose={onClose}
                    />
                )}

                {(isIdle || isSubmitting) && (
                    <ApplicationFormFields
                        formData={formData}
                        opportunityTitle={opportunity.title}
                        onChange={handleInputChange}
                    />
                )}
            </ModalBody>

            {/* Footer - Idle state */}
            {isIdle && (
                <ModalFooter className="flex gap-4">
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-full transition-colors"
                    >
                        Back to Details
                    </button>
                    <button
                        type="submit"
                        onClick={onSubmit}
                        className="flex-1 bg-wiria-blue-dark hover:bg-wiria-yellow hover:text-wiria-blue-dark text-white font-bold py-3 px-6 rounded-full transition-colors"
                    >
                        Submit Application
                    </button>
                </ModalFooter>
            )}

            {/* Footer - Submitting state */}
            {isSubmitting && (
                <ModalFooter>
                    <button
                        disabled
                        className="w-full bg-wiria-blue-dark text-white font-bold py-3 px-6 rounded-full opacity-50 cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Submitting...
                    </button>
                </ModalFooter>
            )}
        </ModalOverlay>
    );
}
