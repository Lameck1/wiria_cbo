import { useState } from 'react';
import { notificationService } from '@/shared/services/notification/notificationService';
import { API_ENDPOINTS } from '@/shared/services/api/endpoints';
import { useBackendStatus } from '@/shared/services/backendStatus';
import { emailJsService } from '@/shared/services/emailJsService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

export interface SafeguardingReportData {
    isAnonymous: boolean;
    reporterName?: string;
    reporterEmail?: string;
    reporterPhone?: string;
    reporterRelation?: string;
    category: string;
    incidentDate?: string;
    location?: string;
    personsInvolved?: string;
    description: string;
}

export interface ReportLookupResult {
    referenceNumber: string;
    status: string;
    category: string;
    createdAt: string;
    updatedAt: string;
}

interface SubmitResponse {
    success: boolean;
    data: {
        referenceNumber: string;
        message: string;
    };
}

interface LookupResponse {
    success: boolean;
    data: ReportLookupResult;
}

export function useSafeguardingReport() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLookingUp, setIsLookingUp] = useState(false);
    const [submittedReference, setSubmittedReference] = useState<string | null>(null);
    const [lookupResult, setLookupResult] = useState<ReportLookupResult | null>(null);
    const [lookupError, setLookupError] = useState<string | null>(null);
    const { isBackendConnected } = useBackendStatus();

    const submitReport = async (data: SafeguardingReportData, evidenceFile?: File): Promise<boolean> => {
        setIsSubmitting(true);
        setSubmittedReference(null);

        try {
            if (isBackendConnected) {
                try {
                    // Primary: Backend API
                    const formData = new FormData();

                    // Append all form fields
                    Object.entries(data).forEach(([key, value]) => {
                        if (value !== undefined && value !== '') {
                            formData.append(key, String(value));
                        }
                    });

                    // Append file if provided
                    if (evidenceFile) {
                        formData.append('evidence', evidenceFile);
                    }

                    // Use fetch directly for multipart/form-data
                    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SAFEGUARDING_SUBMIT}`, {
                        method: 'POST',
                        body: formData,
                    });

                    if (!response.ok) {
                        throw new Error('Failed to submit report');
                    }

                    const result: SubmitResponse = await response.json();
                    setSubmittedReference(result.data.referenceNumber);
                    notificationService.success('Report submitted successfully. Please save your reference number.');
                    return true;
                } catch (apiError) {
                    console.warn('[useSafeguardingReport] Primary API failed, attempting EmailJS fallback...', apiError);
                    // Fallback: EmailJS
                    await emailJsService.sendSafeguardingReport(data);
                    notificationService.success('Your report has been submitted directly to our safeguarding team via our offline channel.');
                    return true;
                }
            } else {
                // Pre-detected Offline: Fallback to EmailJS
                await emailJsService.sendSafeguardingReport(data);
                console.log('[useSafeguardingReport] Fallback to EmailJS successful');
                notificationService.success('Your report has been submitted directly to our safeguarding team via our offline channel.');
                return true;
            }
        } catch (error) {
            console.error('[useSafeguardingReport] Report submission failed:', error);
            notificationService.error(
                'Failed to submit report. Please try again or contact us directly.'
            );
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    const lookupStatus = async (referenceNumber: string, email?: string): Promise<boolean> => {
        setIsLookingUp(true);
        setLookupResult(null);
        setLookupError(null);

        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SAFEGUARDING_LOOKUP}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    referenceNumber,
                    email: email || undefined,
                }),
            });

            if (!response.ok) {
                throw new Error('Report not found');
            }

            const result: LookupResponse = await response.json();
            setLookupResult(result.data);
            return true;
        } catch {
            setLookupError('Report not found. Please check your reference number.');
            return false;
        } finally {
            setIsLookingUp(false);
        }
    };

    const resetSubmission = () => {
        setSubmittedReference(null);
    };

    const resetLookup = () => {
        setLookupResult(null);
        setLookupError(null);
    };

    return {
        submitReport,
        lookupStatus,
        isSubmitting,
        isLookingUp,
        submittedReference,
        lookupResult,
        lookupError,
        resetSubmission,
        resetLookup,
    };
}
