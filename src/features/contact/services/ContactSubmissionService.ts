import { apiClient } from '@/shared/services/api/client';
import { API_ENDPOINTS } from '@/shared/services/api/endpoints';
import { emailJsService } from '@/shared/services/emailJsService';
import { logger } from '@/shared/services/logger';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface SubmissionResult {
  success: boolean;
  method: 'api' | 'emailjs' | 'none';
  error?: unknown;
}

/**
 * Service responsible for submitting contact form data via API or EmailJS fallback
 */
export class ContactSubmissionService {
  /**
   * Attempt to submit via primary API
   */
  async submitViaApi(data: ContactFormData): Promise<SubmissionResult> {
    try {
      await apiClient.post(API_ENDPOINTS.CONTACT_SUBMIT, data);
      logger.debug('[ContactSubmissionService] API submission successful');
      return { success: true, method: 'api' };
    } catch (error) {
      logger.warn('[ContactSubmissionService] API submission failed', error);
      return { success: false, method: 'api', error };
    }
  }

  /**
   * Fallback submission via EmailJS
   */
  async submitViaEmailJs(data: ContactFormData): Promise<SubmissionResult> {
    try {
      const result = await emailJsService.sendContactForm(data);
      if (result.status === 'SUCCESS') {
        logger.debug('[ContactSubmissionService] EmailJS submission successful');
        return { success: true, method: 'emailjs' };
      }
      logger.error('[ContactSubmissionService] EmailJS submission failed', result);
      return { success: false, method: 'emailjs', error: result };
    } catch (error) {
      logger.error('[ContactSubmissionService] EmailJS submission error', error);
      return { success: false, method: 'emailjs', error };
    }
  }

  /**
   * Submit contact form with automatic fallback strategy
   */
  async submit(
    data: ContactFormData,
    isBackendConnected: boolean
  ): Promise<SubmissionResult> {
    // If backend is connected, try API first, then fallback to EmailJS
    if (isBackendConnected) {
      const apiResult = await this.submitViaApi(data);
      if (apiResult.success) {
        return apiResult;
      }

      logger.debug('[ContactSubmissionService] Falling back to EmailJS');
      return await this.submitViaEmailJs(data);
    }

    // If backend is not connected, use EmailJS directly
    logger.debug('[ContactSubmissionService] Backend not connected, using EmailJS');
    return await this.submitViaEmailJs(data);
  }
}

// Singleton instance
export const contactSubmissionService = new ContactSubmissionService();
