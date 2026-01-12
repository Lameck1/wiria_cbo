/**
 * API Endpoints
 * Centralized endpoint constants
 */

export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/auth/login',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_ME: '/auth/me',
  AUTH_RESET_PASSWORD_REQUEST: '/auth/reset-password/request',
  AUTH_RESET_PASSWORD_CONFIRM: '/auth/reset-password/confirm',

  // Members
  MEMBERS_REGISTER: '/members/register',
  MEMBERS_LOGIN: '/members/login',
  MEMBERS_LOGOUT: '/members/logout',
  MEMBERS_ME: '/members/me',
  MEMBERS_RENEW: '/members/renew',
  MEMBERS_CHANGE_PASSWORD: '/members/change-password',
  MEMBERS_PAYMENTS: '/members/payments',
  MEMBERS_DOCUMENTS: '/members/documents',
  MEMBERS_ACTIVITY: '/members/activity',
  MEMBERS_MEETINGS: '/members/meetings',
  MEMBERS_MEETINGS_AVAILABLE: '/members/meetings/available',
  MEMBERS_MEETINGS_JOIN: '/members/meetings/:id/join',
  MEMBERS_MEETINGS_RSVP: '/members/meetings/:id/rsvp',

  // Donations
  DONATIONS_INITIATE: '/donations/initiate',
  DONATIONS_VERIFY_MANUAL: '/donations/verify-manual',
  DONATIONS_STATUS: '/donations/status',

  // Payments
  PAYMENTS_MANUAL_STATUS: '/payments/manual-status',
  PAYMENTS_VERIFY_C2B: '/payments/verify-c2b',
  PAYMENTS_STATUS: '/payments/status',

  // Contact
  CONTACT_SUBMIT: '/contact',

  // Resources
  RESOURCES: '/resources',
  RESOURCES_LIST: '/resources',
  RESOURCES_DETAIL: '/resources/:id',

  // Careers
  CAREERS_LIST: '/careers',
  CAREERS_DETAIL: '/careers/:id',

  // Opportunities
  OPPORTUNITIES_LIST: '/opportunities',
  OPPORTUNITIES_DETAIL: '/opportunities/:id',

  // Partners
  PARTNERS: '/partners',

  // Updates
  UPDATES: '/updates',
  UPDATES_LIST: '/updates',
  UPDATES_DETAIL: '/updates/:id',

  // Tenders
  TENDERS: '/tenders',
  TENDERS_LIST: '/tenders',
  TENDERS_DETAIL: '/tenders/:id',

  // Safeguarding
  SAFEGUARDING_SUBMIT: '/safeguarding',
  SAFEGUARDING_LOOKUP: '/safeguarding/lookup',

  // Health
  HEALTH: '/health',
} as const;
