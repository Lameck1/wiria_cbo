import ReactGA from 'react-ga4';

// Initialize Google Analytics
export const initAnalytics = (measurementId: string) => {
  if (import.meta.env.PROD) {
    ReactGA.initialize(measurementId);
  }
};

// Track page views
export const trackPageView = (path: string) => {
  if (import.meta.env.PROD) {
    ReactGA.send({ hitType: 'pageview', page: path });
  }
};

// Track events
export const trackEvent = (category: string, action: string, label?: string, value?: number) => {
  if (import.meta.env.PROD) {
    ReactGA.event({
      category,
      action,
      label,
      value,
    });
  }
};

// Track custom events with parameters
export const trackCustomEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (import.meta.env.PROD) {
    ReactGA.event(eventName, parameters);
  }
};

// Set user properties
export const setUserProperty = (property: string, value: string) => {
  if (import.meta.env.PROD) {
    ReactGA.gtag('set', 'user_properties', {
      [property]: value,
    });
  }
};

// Track timing
export const trackTiming = (category: string, variable: string, value: number, label?: string) => {
  if (import.meta.env.PROD) {
    ReactGA.gtag('event', 'timing_complete', {
      name: variable,
      value,
      event_category: category,
      event_label: label,
    });
  }
};

/**
 * Example usage:
 * 
 * // Initialize in main.tsx
 * initAnalytics('G-XXXXXXXXXX');
 * 
 * // Track page views
 * trackPageView('/dashboard');
 * 
 * // Track events
 * trackEvent('button_click', 'submit_form', 'contact_form');
 * 
 * // Track custom events
 * trackCustomEvent('donation_completed', {
 *   amount: 100,
 *   currency: 'KES',
 * });
 * 
 * // Set user properties
 * setUserProperty('user_role', 'member');
 */
