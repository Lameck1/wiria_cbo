/**
 * ApplicationFormModal Component

 * Uses composition pattern with reusable modal components and custom hook
 */

import { useEffect } from 'react';
import { Modal } from '@/shared/components/ui/Modal';
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

        <div>
          <h2 className="text-xl font-bold">Apply for Position</h2>
          <p className="mt-1 text-sm text-white/80">{opportunity.title}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
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
            onClick={onSubmit}
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
