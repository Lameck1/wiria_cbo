/**
 * Performance Monitoring Utilities
 * 
 * Provides performance tracking and monitoring for React components
 * and critical user interactions.
 */

import { useEffect, useRef } from 'react';

import { logger } from '@/shared/services/logger';

interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  mountTime?: number;
  updateTime?: number;
  unmountTime?: number;
}

interface WebVitals {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

interface FirstInputEntry extends PerformanceEntry {
  processingStart: number;
}

interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

const envMode = import.meta.env.MODE;

/**
 * Performance monitoring configuration
 */
const PERFORMANCE_CONFIG = {
  // Thresholds for different metrics (in milliseconds)
  thresholds: {
    componentRender: 16, // 60fps = 16.67ms per frame
    componentMount: 100,
    componentUpdate: 50,
    apiResponse: 500,
    userInteraction: 100,
  },

  // Enable/disable monitoring
  enabled: envMode === 'development' || envMode === 'production',

  // Log to console in development
  logToConsole: envMode === 'development',

  // Send to analytics (placeholder for production)
  sendToAnalytics: false,
};

/**
 * Logs performance metrics to console or analytics
 */
function logPerformance(metrics: PerformanceMetrics | WebVitals) {
  if (!PERFORMANCE_CONFIG.enabled) return;

  if (PERFORMANCE_CONFIG.logToConsole) {
    logger.debug('[Performance]', metrics);
  }

  if (PERFORMANCE_CONFIG.sendToAnalytics) {
    // Placeholder for analytics integration
    // Example: analytics.track('performance', metrics);
  }
}

/**
 * React Hook for monitoring component performance
 * 
 * @example
 * function MyComponent() {
 *   usePerformanceMonitor('MyComponent');
 *   
 *   return <div>Content</div>;
 * }
 */
export function usePerformanceMonitor(componentName: string) {
  const mountTime = useRef<number>(performance.now());
  const renderCount = useRef<number>(0);
  const lastRenderTime = useRef<number>(mountTime.current);

  useEffect(() => {
    const mountDuration = performance.now() - mountTime.current;

    if (mountDuration > PERFORMANCE_CONFIG.thresholds.componentMount) {
      logPerformance({
        componentName,
        renderTime: mountDuration,
        mountTime: mountDuration,
      });
    }
  }, [componentName]);

  useEffect(() => {
    renderCount.current += 1;
    const renderStart = performance.now();

    // Schedule measurement after render
    setTimeout(() => {
      const renderDuration = performance.now() - renderStart;
      const timeSinceLastRender = performance.now() - lastRenderTime.current;

      if (renderDuration > PERFORMANCE_CONFIG.thresholds.componentRender) {
        logPerformance({
          componentName,
          renderTime: renderDuration,
          updateTime: timeSinceLastRender,
        });
      }

      lastRenderTime.current = performance.now();
    }, 0);
  });

  useEffect(() => {
    const mountStart = mountTime.current;
    return () => {
      const unmountTime = performance.now() - mountStart;
      if (unmountTime > PERFORMANCE_CONFIG.thresholds.componentUpdate * 2) {
        logPerformance({
          componentName,
          renderTime: unmountTime,
          unmountTime: unmountTime,
        });
      }
    };
  }, [componentName]);
}

/**
 * Measures the performance of an async function
 * 
 * @example
 * const fetchData = measureAsyncPerformance(
 *   'fetchUserData',
 *   async () => {
 *     const response = await api.get('/user');
 *     return response.data;
 *   }
 * );
 */
export function measureAsyncPerformance<T>(
  operationName: string,
  asyncFunction: () => Promise<T>
): () => Promise<T> {
  return async () => {
    const startTime = performance.now();

    try {
      const result = await asyncFunction();
      const duration = performance.now() - startTime;

      if (duration > PERFORMANCE_CONFIG.thresholds.apiResponse) {
        logPerformance({
          componentName: operationName,
          renderTime: duration,
        });
      }

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      logPerformance({
        componentName: `${operationName}_error`,
        renderTime: duration,
      });
      throw error;
    }
  };
}



/**
 * Measures Web Vitals (Core Web Vitals)
 * This would typically be called once when the app loads
 */
export function measureWebVitals() {
  if (typeof window === 'undefined' || !PERFORMANCE_CONFIG.enabled) return;

  // Largest Contentful Paint (LCP)
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      const lcp: WebVitals = {
        name: 'LCP',
        value: entry.startTime,
        rating: entry.startTime < 2500 ? 'good' : entry.startTime < 4000 ? 'needs-improvement' : 'poor',
      };
      logPerformance(lcp);
    }
  }).observe({ entryTypes: ['largest-contentful-paint'] });

  // First Input Delay (FID)
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      const firstInput = entry as FirstInputEntry;
      const fid: WebVitals = {
        name: 'FID',
        value: firstInput.processingStart - firstInput.startTime,
        rating:
          firstInput.processingStart - firstInput.startTime < 100
            ? 'good'
            : firstInput.processingStart - firstInput.startTime < 300
              ? 'needs-improvement'
              : 'poor',
      };
      logPerformance(fid);
    }
  }).observe({ entryTypes: ['first-input'] });

  // Cumulative Layout Shift (CLS)
  let clsValue = 0;
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      const layoutShift = entry as LayoutShiftEntry;
      if (!layoutShift.hadRecentInput) {
        clsValue += layoutShift.value;
      }
    }
    const cls: WebVitals = {
      name: 'CLS',
      value: clsValue,
      rating: clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs-improvement' : 'poor',
    };
    logPerformance(cls);
  }).observe({ entryTypes: ['layout-shift'] });
}

/**
 * Performance budget tracker
 * Tracks if performance metrics stay within budget
 */
class PerformanceBudget {
  private budgets: Map<string, number> = new Map<string, number>();
  private violations: Map<string, number> = new Map<string, number>();

  setBudget(metric: string, budget: number) {
    this.budgets.set(metric, budget);
  }

  checkBudget(metric: string, actual: number): boolean {
    const budget = this.budgets.get(metric);
    if (!budget) return true;

    const isWithinBudget = actual <= budget;

    if (!isWithinBudget) {
      const violations = this.violations.get(metric) ?? 0;
      this.violations.set(metric, violations + 1);

      logPerformance({
        componentName: `budget_violation_${metric}`,
        renderTime: actual,
      });
    }

    return isWithinBudget;
  }

  getViolations(metric: string): number {
    return this.violations.get(metric) ?? 0;
  }

  getAllViolations(): Record<string, number> {
    return Object.fromEntries(this.violations);
  }
}

// Export a default performance budget instance
const defaultPerformanceBudget = new PerformanceBudget();

// Set default budgets
if (PERFORMANCE_CONFIG.enabled) {
  defaultPerformanceBudget.setBudget('componentRender', PERFORMANCE_CONFIG.thresholds.componentRender);
  defaultPerformanceBudget.setBudget('componentMount', PERFORMANCE_CONFIG.thresholds.componentMount);
  defaultPerformanceBudget.setBudget('apiResponse', PERFORMANCE_CONFIG.thresholds.apiResponse);
  defaultPerformanceBudget.setBudget('userInteraction', PERFORMANCE_CONFIG.thresholds.userInteraction);
}
