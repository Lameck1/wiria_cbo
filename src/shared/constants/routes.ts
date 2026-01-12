/**
 * Application Routes
 * Centralized source of truth for all frontend paths
 */

export const ROUTES = {
  // Public Routes
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  PROGRAMS: '/programs',
  RESOURCES: '/resources',
  OPPORTUNITIES: '/opportunities',
  CAREERS: '/careers',
  DONATIONS: '/donations',
  MEMBERSHIP: '/membership',
  MEMBER_LOGIN: '/member-login',
  STAFF_LOGIN: '/staff-login',
  RESET_PASSWORD: '/reset-password',
  SAFEGUARDING: '/safeguarding',
  ACCEPT_INVITE: '/accept-invite',

  // Member Portal (Protected)
  MEMBER_PORTAL: '/member-portal',
  MEMBER_PROFILE: '/member-profile',
  MEMBER_RENEWAL: '/member-renewal',
  MEMBER_PAYMENTS: '/member-payments',
  MEMBER_MEETINGS: '/member-meetings',

  // Admin/Staff Portal (Protected)
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_MEMBERS: '/admin/members',
  ADMIN_NEWS: '/admin/news',
  ADMIN_TENDERS: '/admin/tenders',
  ADMIN_CAREERS: '/admin/careers',
  ADMIN_OPPORTUNITIES: '/admin/opportunities',
  ADMIN_DONATIONS: '/admin/donations',
  ADMIN_SAFEGUARDING: '/admin/safeguarding',
  ADMIN_CONTACTS: '/admin/contacts',
  ADMIN_USERS: '/admin/users',
  ADMIN_RESOURCES: '/admin/resources',
  ADMIN_MEETINGS: '/admin/meetings',
  ADMIN_HR: '/admin/hr',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
