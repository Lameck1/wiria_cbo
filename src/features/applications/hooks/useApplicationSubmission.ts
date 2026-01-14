import { useState, useCallback } from 'react';

import { apiClient } from '@/shared/services/api/client';

import { ApplicationFormData, ApplicationPayload } from '../types';

export type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export function useApplicationSubmission() {
    const [status, setStatus] = useState<SubmitStatus>('idle');
    const [error, setError] = useState<string | null>(null);

    const submitApplication = useCallback(async (
        data: ApplicationFormData,
        type: 'CAREER' | 'OPPORTUNITY',
        id: string
    ) => {
        setStatus('submitting');
        setError(null);

        // Parse name
        const names = data.fullName.trim().split(/\s+/);
        const firstName = names[0] || '';
        const lastName = names.length > 1 ? names.slice(1).join(' ') : 'Applicant';

        const payload: ApplicationPayload = {
            type,
            firstName,
            lastName,
            email: data.email,
            phone: data.phone.replaceAll(/\s+/g, ''),
            coverLetter: data.motivation,
            resumeUrl: data.cvLink || null,
            additionalDocs: data.coverLetterLink ? [data.coverLetterLink] : [],
            ...(type === 'CAREER' ? { careerId: id } : { opportunityId: id }),
        };

        try {
            await apiClient.post('/applications', payload);
            setStatus('success');
        } catch (error_) {
            console.error('Application submission error:', error_);
            setError(error_ instanceof Error ? error_.message : 'Failed to submit application');
            setStatus('error');
        }
    }, []);

    return {
        status,
        error,
        submitApplication,
        reset: () => {
            setStatus('idle');
            setError(null);
        }
    };
}
