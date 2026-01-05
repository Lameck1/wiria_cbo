/**
 * Contact Form Hook
 */

import { useState } from 'react';
import { apiClient } from '@/shared/services/api/client';
import { notificationService } from '@/shared/services/notification/notificationService';
import { API_ENDPOINTS } from '@/shared/services/api/endpoints';

interface ContactFormData {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}

export function useContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitContactForm = async (data: ContactFormData) => {
        setIsSubmitting(true);

        try {
            await apiClient.post(API_ENDPOINTS.CONTACT_SUBMIT, data);
            notificationService.success(
                'Thank you for your message! We will get back to you soon.'
            );
            return true;
        } catch (_error) {
            notificationService.error('Failed to send message. Please try again.');
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        submitContactForm,
        isSubmitting,
    };
}
