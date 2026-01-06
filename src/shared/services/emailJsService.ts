/**
 * EmailJS Service
 * Handles automated form submissions when the backend is offline
 */

import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env['VITE_EMAILJS_SERVICE_ID'] || '';
const TEMPLATE_ID = import.meta.env['VITE_EMAILJS_TEMPLATE_ID'] || '';
const SAFEGUARDING_TEMPLATE_ID = import.meta.env['VITE_EMAILJS_SAFEGUARDING_TEMPLATE_ID'] || '';
const PUBLIC_KEY = import.meta.env['VITE_EMAILJS_PUBLIC_KEY'] || '';

// Initialize EmailJS
if (PUBLIC_KEY) {
    emailjs.init(PUBLIC_KEY);
}

export interface EmailJSResponse {
    status: number;
    text: string;
}

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
    }): Promise<EmailJSResponse> {
        if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
            console.warn('[EmailJS] Configuration missing. Cannot send email.');
            return { status: 0, text: 'Configuration missing' };
        }

        const templateParams = {
            name: data.name,
            email: data.email,
            phone: data.phone || 'N/A',
            title: data.subject,
            message: data.message,
            form_type: 'CONTACT_FORM'
        };

        try {
            const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
            console.log('[EmailJS] Contact form sent successfully', response);
            return response;
        } catch (error) {
            console.error('[EmailJS] Failed to send contact form', error);
            throw error;
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
    }): Promise<EmailJSResponse> {
        const targetTemplateId = SAFEGUARDING_TEMPLATE_ID || TEMPLATE_ID;

        if (!SERVICE_ID || !targetTemplateId || !PUBLIC_KEY) {
            console.warn('[EmailJS] Configuration missing. Cannot send email.');
            return { status: 0, text: 'Configuration missing' };
        }

        const templateParams = {
            name: data.isAnonymous ? 'ANONYMOUS REPORTER' : data.reporterName,
            email: data.isAnonymous ? 'N/A' : data.reporterEmail,
            phone: data.isAnonymous ? 'N/A' : data.reporterPhone,
            relation: data.reporterRelation || 'N/A',
            category: data.category,
            incident_date: data.incidentDate || 'N/A',
            location: data.location || 'N/A',
            involved: data.personsInvolved || 'N/A',
            title: `SAFEGUARDING REPORT: ${data.category}`,
            message: data.description,
            form_type: 'SAFEGUARDING_REPORT'
        };

        try {
            const response = await emailjs.send(SERVICE_ID, targetTemplateId, templateParams);
            console.log('[EmailJS] Safeguarding report sent successfully', response);
            return response;
        } catch (error) {
            console.error('[EmailJS] Failed to send safeguarding report', error);
            throw error;
        }
    }
};
