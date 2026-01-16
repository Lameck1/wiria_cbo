import { useState } from 'react';

import { apiClient } from '@/shared/services/api/client';
import { API_ENDPOINTS } from '@/shared/services/api/endpoints';
import { useBackendStatus } from '@/shared/services/useBackendStatus';
import { emailJsService } from '@/shared/services/emailJsService';
import { notificationService } from '@/shared/services/notification/notificationService';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export function useContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isBackendConnected } = useBackendStatus();

  const submitContactForm = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      if (isBackendConnected) {
        try {
          // Primary: Backend API
          await apiClient.post(API_ENDPOINTS.CONTACT_SUBMIT, data);
          notificationService.success('Thank you for your message! We will get back to you soon.');
          return true;
        } catch (apiError) {
          // If it's a network error (server refused) or 404, try EmailJS as a double fallback
          console.warn(
            '[useContactForm] Primary API failed, attempting EmailJS fallback...',
            apiError
          );
          await emailJsService.sendContactForm(data);
          notificationService.success('Your message has been sent via our alternative channel.');
          return true;
        }
      } else {
        // Pre-detected Offline: Fallback to EmailJS
        await emailJsService.sendContactForm(data);
        notificationService.success('Your message has been sent via our alternative channel.');
        return true;
      }
    } catch (error) {
      console.error('[useContactForm] Form submission failed:', error);
      notificationService.error('Failed to send message. Please try again or contact us directly.');
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
