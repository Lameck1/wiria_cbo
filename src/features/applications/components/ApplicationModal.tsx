import { useState } from 'react';
import { Modal } from '@/shared/components/ui/Modal';
import { Form } from '@/shared/components/ui/form';
import { ApplicationFormFields } from './ApplicationFormFields';
import { applicationSchema, ApplicationFormData } from '../types';
import { useApplicationSubmission } from '../hooks/useApplicationSubmission';

interface ApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBack: () => void;
    title: string;
    itemId: string;
    type: 'CAREER' | 'OPPORTUNITY';
}

function SuccessView({ title, email, onClose }: { title: string; email: string; onClose: () => void }) {
    return (
        <div className="py-8 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <svg className="h-10 w-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h3 className="mb-2 text-2xl font-bold text-gray-800">Application Submitted!</h3>
            <p className="mx-auto mb-6 max-w-md text-gray-600">
                Thank you for applying for <strong>{title}</strong>. We'll review your application and get back to you soon.
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

function ErrorView({ error, onRetry, onClose }: { error: string; onRetry: () => void; onClose: () => void }) {
    return (
        <div className="py-8 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                <svg className="h-10 w-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
            <h3 className="mb-2 text-2xl font-bold text-gray-800">Something went wrong</h3>
            <p className="mb-8 text-gray-600">{error || 'Failed to submit your application. Please try again.'}</p>
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

export function ApplicationModal({ isOpen, onClose, onBack, title, itemId, type }: ApplicationModalProps) {
    const { status, error, submitApplication, reset } = useApplicationSubmission();
    const [submittedEmail, setSubmittedEmail] = useState('');

    if (!isOpen) return null;

    const handleFormSubmit = async (data: ApplicationFormData) => {
        setSubmittedEmail(data.email);
        await submitApplication(data, type, itemId);
    };

    const isSuccess = status === 'success';
    const isError = status === 'error';
    const isSubmitting = status === 'submitting';
    const isIdle = status === 'idle';

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl" noPadding>
            <div className="relative flex-shrink-0 bg-gradient-to-r from-wiria-blue-dark to-blue-700 p-6 text-white">
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div>
                    <h2 className="text-xl font-bold">Apply for Position</h2>
                    <p className="mt-1 text-sm text-white/80">{title}</p>
                </div>
            </div>

            <div className="p-6">
                {isSuccess && <SuccessView title={title} email={submittedEmail} onClose={onClose} />}
                {isError && <ErrorView error={error || ''} onRetry={reset} onClose={onClose} />}
                {(isIdle || isSubmitting) && (
                    <Form schema={applicationSchema} onSubmit={handleFormSubmit}>
                        {() => (
                            <>
                                <ApplicationFormFields title={title} />
                                <div className="mt-8 flex gap-4 border-t pt-6">
                                    <button
                                        type="button"
                                        onClick={onBack}
                                        className="flex-1 rounded-full bg-gray-200 px-6 py-3 font-bold text-gray-700 transition-colors hover:bg-gray-300"
                                    >
                                        Back to Details
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 rounded-full bg-wiria-blue-dark px-6 py-3 font-bold text-white transition-colors hover:bg-wiria-yellow hover:text-wiria-blue-dark disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                                    </button>
                                </div>
                            </>
                        )}
                    </Form>
                )}
            </div>
        </Modal>
    );
}
