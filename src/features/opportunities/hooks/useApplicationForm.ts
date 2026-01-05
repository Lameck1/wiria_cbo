/**
 * useApplicationForm Hook
 * Single responsibility: Manage application form state, validation, and submission
 */

import { useState, useCallback } from 'react';

export interface ApplicationFormData {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    education: string;
    fieldOfStudy: string;
    experience: string;
    motivation: string;
    skills: string;
    cvLink: string;
    coverLetterLink: string;
    consent: boolean;
}

export type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const INITIAL_FORM_DATA: ApplicationFormData = {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    education: '',
    fieldOfStudy: '',
    experience: '',
    motivation: '',
    skills: '',
    cvLink: '',
    coverLetterLink: '',
    consent: false,
};

interface UseApplicationFormResult {
    formData: ApplicationFormData;
    submitStatus: SubmitStatus;
    errorMessage: string;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleSubmit: (opportunityId: string) => Promise<void>;
    resetForm: () => void;
    retrySubmit: () => void;
}

export function useApplicationForm(): UseApplicationFormResult {
    const [formData, setFormData] = useState<ApplicationFormData>(INITIAL_FORM_DATA);
    const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = useCallback((
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }, []);

    const handleSubmit = useCallback(async (opportunityId: string) => {
        setSubmitStatus('submitting');
        setErrorMessage('');

        // Parse name
        const names = formData.fullName.trim().split(/\s+/);
        const firstName = names[0] || '';
        const lastName = names.length > 1 ? names.slice(1).join(' ') : 'Applicant';

        const payload = {
            type: 'OPPORTUNITY',
            firstName,
            lastName,
            email: formData.email,
            phone: formData.phone.replace(/\s+/g, ''),
            coverLetter: formData.motivation,
            opportunityId,
            resumeUrl: formData.cvLink || null,
            additionalDocs: formData.coverLetterLink ? [formData.coverLetterLink] : [],
        };

        try {
            const response = await fetch('/api/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to submit application');
            }

            setSubmitStatus('success');
        } catch (error) {
            console.error('Application submission error:', error);
            setErrorMessage(error instanceof Error ? error.message : 'Failed to submit application');
            setSubmitStatus('error');
        }
    }, [formData]);

    const resetForm = useCallback(() => {
        setFormData(INITIAL_FORM_DATA);
        setSubmitStatus('idle');
        setErrorMessage('');
    }, []);

    const retrySubmit = useCallback(() => {
        setSubmitStatus('idle');
        setErrorMessage('');
    }, []);

    return {
        formData,
        submitStatus,
        errorMessage,
        handleInputChange,
        handleSubmit,
        resetForm,
        retrySubmit,
    };
}
