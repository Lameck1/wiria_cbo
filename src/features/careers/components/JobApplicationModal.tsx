/**
 * JobApplicationModal Component

 * Styled consistently with ApplicationFormModal
 */

import { useEffect } from 'react';
import { Modal } from '@/shared/components/ui/Modal';
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
function SuccessView({
  jobTitle,
  email,
  onClose,
}: {
  jobTitle: string;
  email: string;
  onClose: () => void;
}) {
  return (
    <div className="py-8 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <svg
          className="h-10 w-10 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="mb-2 text-2xl font-bold text-gray-800">Application Submitted!</h3>
      <p className="mx-auto mb-6 max-w-md text-gray-600">
        Thank you for applying for <strong>{jobTitle}</strong>. We'll review your application and
        get back to you soon.
      </p>
      <p className="mb-8 text-sm text-gray-500">
        A confirmation email has been sent to <strong>{email}</strong>
      </p>
      <button
        onClick={onClose}
        className="rounded-full bg-wiria-blue-dark px-8 py-3 font-semibold text-white transition-all hover:bg-wiria-yellow hover:text-wiria-blue-dark"
      >
        Done
      </button>
    </div>
  );
}

// Error View Component
function ErrorView({
  errorMessage,
  onRetry,
  onClose,
}: {
  errorMessage: string;
  onRetry: () => void;
  onClose: () => void;
}) {
  return (
    <div className="py-8 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
        <svg
          className="h-10 w-10 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <h3 className="mb-2 text-2xl font-bold text-gray-800">Something went wrong</h3>
      <p className="mb-8 text-gray-600">
        {errorMessage || 'Failed to submit your application. Please try again.'}
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={onClose}
          className="rounded-full border border-gray-300 px-6 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={onRetry}
          className="rounded-full bg-wiria-blue-dark px-8 py-2.5 font-semibold text-white transition-all hover:bg-wiria-yellow hover:text-wiria-blue-dark"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

export function JobApplicationModal({ job, isOpen, onClose, onBack }: JobApplicationModalProps) {
  const {
    formData,
    submitStatus,
    errorMessage,
    handleInputChange,
    handleSubmit,
    resetForm,
    retrySubmit,
  } = useJobApplication();

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
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" noPadding>
      {/* Header */}
      <div className="relative flex-shrink-0 bg-gradient-to-r from-wiria-blue-dark to-blue-700 p-6 text-white">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          aria-label="Close modal"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="relative z-10">
          <h2 className="text-xl font-bold">Apply for Position</h2>
          <p className="mt-1 text-sm text-white/80">{job.title}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        {isSuccess && <SuccessView jobTitle={job.title} email={formData.email} onClose={onClose} />}

        {isError && (
          <ErrorView errorMessage={errorMessage} onRetry={retrySubmit} onClose={onClose} />
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
      </div>

      {/* Footer - Idle state */}
      {isIdle && (
        <div className="flex gap-4 border-t p-6">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 rounded-full bg-gray-200 px-6 py-3 font-bold text-gray-700 transition-colors hover:bg-gray-300"
          >
            Back to Details
          </button>
          <button
            type="submit"
            form="job-application-form"
            className="flex-1 rounded-full bg-wiria-blue-dark px-6 py-3 font-bold text-white transition-colors hover:bg-wiria-yellow hover:text-wiria-blue-dark"
          >
            Submit Application
          </button>
        </div>
      )}

      {/* Footer - Submitting state */}
      {isSubmitting && (
        <div className="border-t p-6">
          <button
            disabled
            className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-wiria-blue-dark px-6 py-3 font-bold text-white opacity-50"
          >
            <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Submitting...
          </button>
        </div>
      )}
    </Modal>
  );
}
