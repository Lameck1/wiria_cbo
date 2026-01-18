import { logger } from '../logger';

import type { ApiClient } from './client';

/**
 * Configuration for resilient API behavior
 */
export interface ResilienceConfig {
  /** Maximum number of retry attempts */
  maxRetries: number;
  /** Initial delay in ms before first retry */
  initialRetryDelay: number;
  /** Multiplier for exponential backoff */
  backoffMultiplier: number;
  /** Maximum delay in ms between retries */
  maxRetryDelay: number;
  /** HTTP status codes that should trigger a retry */
  retryableStatusCodes: number[];
  /** Whether to enable fallback to cached responses */
  enableFallback: boolean;
}

/**
 * Default resilience configuration
 */
const DEFAULT_CONFIG: ResilienceConfig = {
  maxRetries: 3,
  initialRetryDelay: 1000,
  backoffMultiplier: 2,
  maxRetryDelay: 10000,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
  enableFallback: true,
};

/**
 * Cache entry for fallback responses
 */
interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  maxAge: number;
}

/**
 * ResilientApiClient provides automatic retry logic and fallback mechanisms
 * for improved reliability when making API calls.
 * 
 * Features:
 * - Automatic retry with exponential backoff
 * - Configurable retry conditions
 * - Response caching for fallback
 * - Request deduplication
 * - Comprehensive error handling
 */
export class ResilientApiClient {
  private cache = new Map<string, CacheEntry>();
  private pendingRequests = new Map<string, Promise<unknown>>();

  constructor(
    private apiClient: ApiClient,
    private config: ResilienceConfig = DEFAULT_CONFIG
  ) { }

  /**
   * Calculate delay for retry attempt using exponential backoff
   */
  private calculateRetryDelay(attemptNumber: number): number {
    const delay = Math.min(
      this.config.initialRetryDelay * Math.pow(this.config.backoffMultiplier, attemptNumber),
      this.config.maxRetryDelay
    );
    // Add jitter to prevent thundering herd
    return delay + Math.random() * 1000;
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
      return false;
    }

    const candidate = error as { name?: string; message?: string; status?: number };

    const isNetworkError =
      candidate.name === 'NetworkError' ||
      candidate.message?.toLowerCase().includes('network') === true;

    const hasRetryableStatus =
      typeof candidate.status === 'number' &&
      this.config.retryableStatusCodes.includes(candidate.status);

    return isNetworkError || hasRetryableStatus;
  }

  /**
   * Wait for specified duration
   */
  private async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generate cache key from request parameters
   */
  private getCacheKey(
    method: string,
    url: string,
    params?: Record<string, unknown>
  ): string {
    return `${method}:${url}:${JSON.stringify(params ?? {})}`;
  }

  /**
   * Get cached response if available and not expired
   */
  private getCachedResponse<T>(cacheKey: string): T | null {
    const entry = this.cache.get(cacheKey);
    if (!entry) return null;

    const age = Date.now() - entry.timestamp;
    if (age > entry.maxAge) {
      this.cache.delete(cacheKey);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Store response in cache
   */
  private setCachedResponse<T>(cacheKey: string, data: T, maxAge = 300000): void {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      maxAge,
    });
  }

  /**
   * Execute request with retry logic
   */
  private async executeWithRetry<T>(
    requestFunction: () => Promise<T>,
    cacheKey?: string
  ): Promise<T> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        const response = await requestFunction();

        // Cache successful GET responses
        if (cacheKey && this.config.enableFallback) {
          this.setCachedResponse(cacheKey, response);
        }

        return response;
      } catch (error: unknown) {
        lastError = error;

        // Don't retry if not retryable or on last attempt
        if (!this.isRetryableError(error) || attempt === this.config.maxRetries) {
          break;
        }

        const delay = this.calculateRetryDelay(attempt);
        logger.warn(
          `Request failed (attempt ${attempt + 1}/${this.config.maxRetries + 1}), retrying in ${delay}ms`,
          error
        );
        await this.wait(delay);
      }
    }

    // Try fallback to cached response
    if (cacheKey && this.config.enableFallback) {
      const cached = this.getCachedResponse<T>(cacheKey);
      if (cached) {
        logger.warn('Using cached fallback response after all retries failed');
        return cached;
      }
    }

    // All retries failed and no fallback available
    throw lastError;
  }

  /**
   * GET request with resilience
   */
  async get<T = unknown>(url: string, params?: Record<string, string>): Promise<T> {
    const cacheKey = this.getCacheKey('GET', url, params);

    // Request deduplication: return existing pending request if any
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)! as Promise<T>;
    }

    const requestPromise = this.executeWithRetry<T>(
      () => this.apiClient.get<T>(url, params),
      cacheKey
    );

    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      return await requestPromise;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  /**
   * POST request with resilience (no caching)
   */
  async post<T = unknown>(url: string, data?: unknown): Promise<T> {
    return this.executeWithRetry<T>(() => this.apiClient.post<T>(url, data));
  }

  /**
   * PUT request with resilience (no caching)
   */
  async put<T = unknown>(url: string, data?: unknown): Promise<T> {
    return this.executeWithRetry<T>(() => this.apiClient.put<T>(url, data));
  }

  /**
   * PATCH request with resilience (no caching)
   */
  async patch<T = unknown>(url: string, data?: unknown): Promise<T> {
    return this.executeWithRetry<T>(() => this.apiClient.patch<T>(url, data));
  }

  /**
   * DELETE request with resilience (no caching)
   */
  async delete<T = unknown>(url: string): Promise<T> {
    return this.executeWithRetry<T>(() => this.apiClient.delete<T>(url));
  }

  /**
   * Clear all cached responses
   */
  clearCache(): void {
    this.cache.clear();
    logger.debug('Cleared all cached API responses');
  }

  /**
   * Clear cached response for specific request
   */
  clearCacheFor(method: string, url: string, params?: Record<string, unknown>): void {
    const cacheKey = this.getCacheKey(method, url, params);
    this.cache.delete(cacheKey);
  }

  /**
   * Update resilience configuration
   */
  updateConfig(config: Partial<ResilienceConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

/**
 * Create a resilient API client with default configuration
 */
export function createResilientApiClient(
  apiClient: ApiClient,
  config?: Partial<ResilienceConfig>
): ResilientApiClient {
  return new ResilientApiClient(apiClient, { ...DEFAULT_CONFIG, ...config });
}
