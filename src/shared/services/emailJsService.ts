/**
 * EmailJS Service
 * Handles automated form submissions when the backend is offline
 */

import { init, send, type EmailJSResponseStatus } from '@emailjs/browser';

import { logger } from '@/shared/services/logger';

const SERVICE_ID = String(import.meta.env['VITE_EMAILJS_SERVICE_ID'] ?? '');
const TEMPLATE_ID = String(import.meta.env['VITE_EMAILJS_TEMPLATE_ID'] ?? '');
const SAFEGUARDING_TEMPLATE_ID = String(import.meta.env['VITE_EMAILJS_SAFEGUARDING_TEMPLATE_ID'] ?? '');
const PUBLIC_KEY = String(import.meta.env['VITE_EMAILJS_PUBLIC_KEY'] ?? '');

// Initialize EmailJS
if (PUBLIC_KEY) {
  init(PUBLIC_KEY);
}

export type EmailSendStatus = 'SUCCESS' | 'CONFIG_MISSING' | 'PROVIDER_ERROR';

export interface EmailSendResult {
  status: EmailSendStatus;
  message: string;
}

const mapResponseToResult = (response: EmailJSResponseStatus, context: string): EmailSendResult => {
  if (response.status >= 200 && response.status < 300) {
    return { status: 'SUCCESS', message: `${context} sent successfully` };
  }
  return {
    status: 'PROVIDER_ERROR',
    message: `${context} provider error (${response.status})`,
  };
};

const configMissingResult: EmailSendResult = {
  status: 'CONFIG_MISSING',
  message: 'Email service configuration is missing',
};

export const emailJsService = {
  /**
   * Send a contact form message via EmailJS
   */
  async sendContactForm(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Promise<EmailSendResult> {
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      logger.warn('[EmailJS] Contact form configuration missing');
      return configMissingResult;
    }

    const templateParams = {
      name: data.name,
      email: data.email,
      phone: data.phone ?? 'N/A',
      title: data.subject,
      message: data.message,
      form_type: 'CONTACT_FORM',
    };

    try {
      const response = await send(SERVICE_ID, TEMPLATE_ID, templateParams);
      const result = mapResponseToResult(response, 'Contact form');
      if (result.status === 'PROVIDER_ERROR') {
        logger.error('[EmailJS] Failed to send contact form', response);
      }
      return result;
    } catch (error) {
      logger.error('[EmailJS] Failed to send contact form', error);
      return {
        status: 'PROVIDER_ERROR',
        message: 'Contact form could not be sent',
      };
    }
  },

  /**
   * Send a safeguarding report via EmailJS
   */
  async sendSafeguardingReport(data: {
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
  }): Promise<EmailSendResult> {
    const targetTemplateId = SAFEGUARDING_TEMPLATE_ID ?? TEMPLATE_ID;

    if (!SERVICE_ID || !targetTemplateId || !PUBLIC_KEY) {
      logger.warn('[EmailJS] Safeguarding configuration missing');
      return configMissingResult;
    }

    const templateParams = {
      name: data.isAnonymous ? 'ANONYMOUS REPORTER' : data.reporterName,
      email: data.isAnonymous ? 'N/A' : data.reporterEmail,
      phone: data.isAnonymous ? 'N/A' : data.reporterPhone,
      relation: data.reporterRelation ?? 'N/A',
      category: data.category,
      incident_date: data.incidentDate ?? 'N/A',
      location: data.location ?? 'N/A',
      involved: data.personsInvolved ?? 'N/A',
      title: `SAFEGUARDING REPORT: ${data.category}`,
      message: data.description,
      form_type: 'SAFEGUARDING_REPORT',
    };

    try {
      const response = await send(SERVICE_ID, targetTemplateId, templateParams);
      const result = mapResponseToResult(response, 'Safeguarding report');
      if (result.status === 'PROVIDER_ERROR') {
        logger.error('[EmailJS] Failed to send safeguarding report', response);
      }
      return result;
    } catch (error) {
      logger.error('[EmailJS] Failed to send safeguarding report', error);
      return {
        status: 'PROVIDER_ERROR',
        message: 'Safeguarding report could not be sent',
      };
    }
  },

  async sendNewsletterSubscription(data: { email: string }): Promise<EmailSendResult> {
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      logger.warn('[EmailJS] Newsletter configuration missing');
      return configMissingResult;
    }

    const templateParams = {
      name: data.email,
      email: data.email,
      phone: 'N/A',
      title: 'Newsletter subscription',
      message: 'Please add this email to the newsletter mailing list.',
      form_type: 'NEWSLETTER_SUBSCRIPTION',
    };

    try {
      const response = await send(SERVICE_ID, TEMPLATE_ID, templateParams);
      const result = mapResponseToResult(response, 'Newsletter subscription');
      if (result.status === 'PROVIDER_ERROR') {
        logger.error('[EmailJS] Failed to send newsletter subscription', response);
      }
      return result;
    } catch (error) {
      logger.error('[EmailJS] Failed to send newsletter subscription', error);
      return {
        status: 'PROVIDER_ERROR',
        message: 'Newsletter subscription could not be sent',
      };
    }
  },
};
