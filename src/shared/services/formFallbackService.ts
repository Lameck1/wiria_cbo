/**
 * Form Fallback Service
 * Handles formatting and redirection for forms when the backend is offline
 */

export const formFallbackService = {
  /**
   * Redirects to WhatsApp with a pre-formatted message
   */
  sendToWhatsApp: (phoneNumber: string, message: string) => {
    // Clean phone number (remove +, spaces, brackets)
    const cleanPhone = phoneNumber.replace(/[^\d]/g, '');
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, '_blank');
  },

  /**
   * Redirects to default email client with pre-formatted subject and body
   */
  sendToEmail: (email: string, subject: string, body: string) => {
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    window.location.href = `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
  },

  /**
   * Formats contact form data into a readable message
   */
  formatContactMessage: (data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) => {
    return (
      `*New Contact Message via WIRIA Website (Offline Mode)*\n\n` +
      `*Name:* ${data.name}\n` +
      `*Email:* ${data.email}\n` +
      `*Phone:* ${data.phone || 'Not provided'}\n` +
      `*Subject:* ${data.subject}\n\n` +
      `*Message:*\n${data.message}`
    );
  },

  /**
   * Formats safeguarding report data into a readable message
   */
  formatSafeguardingMessage: (data: {
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
  }) => {
    const reporterInfo = data.isAnonymous
      ? '_Anonymous Report_'
      : `*Reporter:* ${data.reporterName || 'N/A'}\n*Email:* ${data.reporterEmail || 'N/A'}\n*Phone:* ${data.reporterPhone || 'N/A'}\n*Relation:* ${data.reporterRelation || 'N/A'}`;

    return (
      `*SAFEGUARDING CONCERN REPORT (Offline Mode)*\n\n` +
      `${reporterInfo}\n\n` +
      `*Category:* ${data.category}\n` +
      `*Incident Date:* ${data.incidentDate || 'Not specified'}\n` +
      `*Location:* ${data.location || 'Not specified'}\n` +
      `*Persons Involved:* ${data.personsInvolved || 'Not specified'}\n\n` +
      `*Description:*\n${data.description}\n\n` +
      `_Note: Submitted via offline fallback. Please investigate promptly._`
    );
  },
};
