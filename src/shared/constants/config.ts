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


