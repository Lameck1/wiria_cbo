import { onCLS, onFID, onFCP, onLCP, onTTFB, Metric } from 'web-vitals';

/**
 * Web Vitals Performance Monitoring
 * 
 * Tracks Core Web Vitals:
 * - CLS (Cumulative Layout Shift): Visual stability
 * - FID (First Input Delay): Interactivity
 * - FCP (First Contentful Paint): Perceived load speed
 * - LCP (Largest Contentful Paint): Loading performance
 * - TTFB (Time to First Byte): Server response time
 */

interface PerformanceMetric extends Metric {
  rating?: 'good' | 'needs-improvement' | 'poor';
}

// Log metrics to console in development
const logMetric = (metric: PerformanceMetric) => {
  if (import.meta.env.DEV) {
    console.log(
      `[Performance] ${metric.name}:`,
      Math.round(metric.value),
      'ms',
      `(${metric.rating || 'unknown'})`
    );
  }
};

// Send metrics to analytics endpoint (customize as needed)
const sendToAnalytics = (metric: PerformanceMetric) => {
  // Example: Send to Google Analytics
  if (window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.value),
      metric_rating: metric.rating,
      metric_delta: Math.round(metric.delta),
      metric_id: metric.id,
    });
  }

  // Example: Send to custom analytics endpoint
  if (import.meta.env.PROD) {
    const body = JSON.stringify(metric);
    const url = '/api/analytics/performance';

    // Use `navigator.sendBeacon()` if available, falling back to `fetch()`.
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, body);
    } else {
      fetch(url, { body, method: 'POST', keepalive: true }).catch(console.error);
    }
  }
};

// Main function to report all Web Vitals
export const reportWebVitals = (onPerfEntry?: (metric: PerformanceMetric) => void) => {
  const handleMetric = (metric: PerformanceMetric) => {
    logMetric(metric);
    sendToAnalytics(metric);
    onPerfEntry?.(metric);
  };

  onCLS(handleMetric);
  onFID(handleMetric);
  onFCP(handleMetric);
  onLCP(handleMetric);
  onTTFB(handleMetric);
};

// Helper to get performance metrics summary
export const getPerformanceMetrics = () => {
  if (!window.performance) {
    return null;
  }

  const perfData = window.performance.timing;
  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
  const connectTime = perfData.responseEnd - perfData.requestStart;
  const renderTime = perfData.domComplete - perfData.domLoading;

  return {
    pageLoadTime,
    connectTime,
    renderTime,
    domInteractive: perfData.domInteractive - perfData.navigationStart,
    domContentLoaded: perfData.domContentLoadedEventEnd - perfData.navigationStart,
  };
};

// TypeScript declarations for global window object
declare global {
  interface Window {
    gtag?: (
      type: string,
      event: string,
      params: Record<string, unknown>
    ) => void;
  }
}
