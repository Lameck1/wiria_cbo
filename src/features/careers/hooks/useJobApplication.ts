/**
 * useJobApplication Hook
 * Single responsibility: Manage job application form state and submission
 * Matches the data structure of opportunity applications
 */

import { useState, useCallback } from 'react';

export interface JobApplicationFormData {
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

const INITIAL_FORM_DATA: JobApplicationFormData = {
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

interface UseJobApplicationResult {
    formData: JobApplicationFormData;
    submitStatus: SubmitStatus;
    errorMessage: string;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleSubmit: (careerId: string) => Promise<void>;
    resetForm: () => void;
    retrySubmit: () => void;
}

export function useJobApplication(): UseJobApplicationResult {
    const [formData, setFormData] = useState<JobApplicationFormData>(INITIAL_FORM_DATA);
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

    const handleSubmit = useCallback(async (careerId: string) => {
        setSubmitStatus('submitting');
        setErrorMessage('');

        // Parse name
        const names = formData.fullName.trim().split(/\s+/);
        const firstName = names[0] || '';
        const lastName = names.length > 1 ? names.slice(1).join(' ') : 'Applicant';

        const payload = {
            type: 'CAREER',
            firstName,
            lastName,
            email: formData.email,
            phone: formData.phone.replace(/\s+/g, ''),
            coverLetter: formData.motivation,
            careerId,
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
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || errorData.message || 'Failed to submit application');
            }

            setSubmitStatus('success');
        } catch (error) {
            console.error('Job application submission error:', error);
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
