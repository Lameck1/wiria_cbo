import { useState } from 'react';

import { apiClient } from '@/shared/services/api/client';
import { API_ENDPOINTS } from '@/shared/services/api/endpoints';
import { emailJsService } from '@/shared/services/emailJsService';
import { logger } from '@/shared/services/logger';
import { notificationService } from '@/shared/services/notification/notificationService';
import { useBackendStatus } from '@/shared/services/useBackendStatus';

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
          await apiClient.post(API_ENDPOINTS.CONTACT_SUBMIT, data);
          notificationService.success('Thank you for your message! We will get back to you soon.');
          return true;
        } catch (apiError) {
          logger.warn(
            '[useContactForm] Primary API failed, attempting EmailJS fallback...',
            apiError
          );
          const result = await emailJsService.sendContactForm(data);
          if (result.status === 'SUCCESS') {
            notificationService.success(
              'Your message has been sent via our alternative channel.'
            );
            return true;
          }
          logger.error('[useContactForm] EmailJS fallback failed', result);
          notificationService.error(
            'Failed to send message via our alternative channel. Please try again later.'
          );
          return false;
        }
      } else {
        const result = await emailJsService.sendContactForm(data);
        if (result.status === 'SUCCESS') {
          notificationService.success(
            'Your message has been sent via our alternative channel.'
          );
          return true;
        }
        logger.error('[useContactForm] EmailJS submission failed', result);
        notificationService.error(
          'Failed to send message via our alternative channel. Please try again later.'
        );
        return false;
      }
    } catch (error) {
      logger.error('[useContactForm] Form submission failed:', error);
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
