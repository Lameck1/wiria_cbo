import { useState } from 'react';

import type { ContactFormData } from '@/features/contact/services';
import { contactSubmissionService } from '@/features/contact/services';
import { notificationService } from '@/shared/services/notification/notificationService';
import { useBackendStatus } from '@/shared/services/useBackendStatus';

export type { ContactFormData } from '@/features/contact/services';

/**
 * Hook for managing contact form submission state and logic
 * 
 * Responsibilities:
 * - Managing submission state (isSubmitting)
 * - Coordinating with ContactSubmissionService
 * - Providing user feedback via notifications
 * 
 * Extracted concerns:
 * - Submission logic → ContactSubmissionService
 * - API/EmailJS communication → ContactSubmissionService
 * - Fallback strategy → ContactSubmissionService
 */
export function useContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isBackendConnected } = useBackendStatus();

  const submitContactForm = async (data: ContactFormData): Promise<boolean> => {
    setIsSubmitting(true);

    try {
      const result = await contactSubmissionService.submit(data, isBackendConnected);

      if (result.success) {
        const message =
          result.method === 'api'
            ? 'Thank you for your message! We will get back to you soon.'
            : 'Your message has been sent via our alternative channel.';
        notificationService.success(message);
        return true;
      }

      // Submission failed
      notificationService.error(
        'Failed to send message. Please try again or contact us directly.'
      );
      return false;
    } catch {
      // Unexpected error
      notificationService.error(
        'An unexpected error occurred. Please try again or contact us directly.'
      );
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
