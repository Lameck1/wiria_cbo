/**
 * Application-wide constants
 * Centralized configuration values for consistency and maintainability
 */

/**
 * Timing Constants (in milliseconds)
 */
export const TIMING = {
  /** Debounce delay for search inputs */
  DEBOUNCE_DEFAULT: 300,
  /** Debounce delay for rapid input (e.g., sliders) */
  DEBOUNCE_FAST: 150,
  /** Debounce delay for expensive operations */
  DEBOUNCE_SLOW: 500,
  /** API request timeout */
  API_TIMEOUT: 30000,
  /** Health check timeout */
  HEALTH_CHECK_TIMEOUT: 5000,
  PAYMENT_POLL_INTERVAL: 5000,
  QUERY_DEFAULT_STALE_TIME: 5 * 60 * 1000,
  /** Toast notification display duration */
  TOAST_DURATION: 3000,
  SUCCESS_MESSAGE_DURATION: 5000,
  SUBMIT_COOLDOWN: 10000,
  /** Animation duration for transitions */
  ANIMATION_DURATION: 200,
  /** Polling interval for real-time updates */
  POLLING_INTERVAL: 60000,
} as const;

/**
 * Pagination Constants
 */
export const PAGINATION = {
  /** Default items per page */
  DEFAULT_PAGE_SIZE: 10,
  /** Items per page options for dropdowns */
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100] as const,
  /** Maximum items per page */
  MAX_PAGE_SIZE: 100,
} as const;

/**
 * Form Validation Limits
 */
export const LIMITS = {
  /** Minimum donation amount (KES) */
  MIN_DONATION: 10,
  /** Maximum donation amount (KES) */
  MAX_DONATION: 1000000,
  /** Maximum file upload size (bytes) - 10MB */
  MAX_FILE_SIZE: 10 * 1024 * 1024,
  /** Maximum message length */
  MAX_MESSAGE_LENGTH: 500,
  /** Maximum name length */
  MAX_NAME_LENGTH: 50,
  /** Minimum name length */
  MIN_NAME_LENGTH: 2,
  /** Maximum email length */
  MAX_EMAIL_LENGTH: 100,
  /** Minimum password length */
  MIN_PASSWORD_LENGTH: 8,
} as const;

/**
 * UI Constants
 */
export const UI = {
  /** Number of items to show in "recent" lists */
  RECENT_ITEMS_COUNT: 5,
  /** Number of skeleton loaders to show */
  SKELETON_COUNT: 6,
  /** Mobile breakpoint (px) */
  MOBILE_BREAKPOINT: 768,
  /** Tablet breakpoint (px) */
  TABLET_BREAKPOINT: 1024,
} as const;

/**
 * Status Colors (Tailwind classes)
 */
export const STATUS_COLORS = {
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  pending: 'bg-gray-100 text-gray-700',
} as const;

/**
 * API Response Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;
