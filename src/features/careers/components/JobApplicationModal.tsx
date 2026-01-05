/**
 * JobApplicationModal Component
 * Single responsibility: Handle job application form submission
 * Styled consistently with ApplicationFormModal
 */

import { useEffect } from 'react';
import { ModalOverlay, ModalHeader, ModalBody, ModalFooter } from '@/shared/components/modal';
import { Job } from '../hooks/useCareers';
import { useJobApplication } from '../hooks/useJobApplication';
import { JobApplicationFormFields } from './JobApplicationFormFields';

interface JobApplicationModalProps {
    job: Job | null;
    isOpen: boolean;
    onClose: () => void;
    onBack: () => void;
}

// Success View Component
function SuccessView({ jobTitle, email, onClose }: { jobTitle: string; email: string; onClose: () => void }) {
    return (
        <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted!</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Thank you for applying for <strong>{jobTitle}</strong>.
                We'll review your application and get back to you soon.
            </p>
            <p className="text-sm text-gray-500 mb-8">
                A confirmation email has been sent to <strong>{email}</strong>
            </p>
            <button
                onClick={onClose}
                className="bg-wiria-blue-dark text-white px-8 py-3 rounded-full font-semibold hover:bg-wiria-yellow hover:text-wiria-blue-dark transition-all"
            >
                Done
            </button>
        </div>
    );
}

// Error View Component
function ErrorView({ errorMessage, onRetry, onClose }: { errorMessage: string; onRetry: () => void; onClose: () => void }) {
    return (
        <div className="text-center py-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-8">{errorMessage || 'Failed to submit your application. Please try again.'}</p>
            <div className="flex gap-4 justify-center">
                <button
                    onClick={onClose}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-100 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={onRetry}
                    className="px-8 py-2.5 bg-wiria-blue-dark text-white rounded-full font-semibold hover:bg-wiria-yellow hover:text-wiria-blue-dark transition-all"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}

export function JobApplicationModal({ job, isOpen, onClose, onBack }: JobApplicationModalProps) {
    const { formData, submitStatus, errorMessage, handleInputChange, handleSubmit, resetForm, retrySubmit } = useJobApplication();

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            resetForm();
        }
    }, [isOpen, resetForm]);

    if (!isOpen || !job) return null;

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleSubmit(job.id);
    };

    const isIdle = submitStatus === 'idle';
    const isSubmitting = submitStatus === 'submitting';
    const isSuccess = submitStatus === 'success';
    const isError = submitStatus === 'error';

    return (
        <ModalOverlay isOpen={isOpen} onClose={onClose} maxWidth="2xl">
            {/* Header - Styled like ApplicationFormModal */}
            <ModalHeader
                onClose={onClose}
                className="bg-gradient-to-r from-wiria-blue-dark to-blue-700 text-white"
            >
                <div className="relative z-10">
                    <h2 className="text-xl font-bold">Apply for Position</h2>
                    <p className="text-white/80 text-sm mt-1">{job.title}</p>
                </div>
            </ModalHeader>

            {/* Body */}
            <ModalBody>
                {isSuccess && (
                    <SuccessView
                        jobTitle={job.title}
                        email={formData.email}
                        onClose={onClose}
                    />
                )}

                {isError && (
                    <ErrorView
                        errorMessage={errorMessage}
                        onRetry={retrySubmit}
                        onClose={onClose}
                    />
                )}

                {(isIdle || isSubmitting) && (
                    <form id="job-application-form" onSubmit={handleFormSubmit}>
                        <JobApplicationFormFields
                            formData={formData}
                            jobTitle={job.title}
                            onChange={handleInputChange}
                        />
                    </form>
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
                        form="job-application-form"
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
