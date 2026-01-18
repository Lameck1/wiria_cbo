import { ApiClient, ApiResponse } from './apiClient';
import { logger } from '../logger';

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
interface CacheEntry<T = any> {
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
  private pendingRequests = new Map<string, Promise<any>>();
  
  constructor(
    private apiClient: ApiClient,
    private config: ResilienceConfig = DEFAULT_CONFIG
  ) {}

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
  private isRetryableError(error: any): boolean {
    if (!error || typeof error !== 'object') return false;
    
    // Network errors are retryable
    if (error.name === 'NetworkError' || error.message?.includes('network')) {
      return true;
    }
    
    // Check status codes
    if (error.status && this.config.retryableStatusCodes.includes(error.status)) {
      return true;
    }
    
    return false;
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
  private getCacheKey(method: string, url: string, params?: any): string {
    return `${method}:${url}:${JSON.stringify(params || {})}`;
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
  private setCachedResponse<T>(cacheKey: string, data: T, maxAge: number = 300000): void {
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
    requestFn: () => Promise<ApiResponse<T>>,
    cacheKey?: string
  ): Promise<ApiResponse<T>> {
    let lastError: any;
    
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        const response = await requestFn();
        
        // Cache successful GET responses
        if (cacheKey && this.config.enableFallback) {
          this.setCachedResponse(cacheKey, response);
        }
        
        return response;
      } catch (error) {
        lastError = error;
        
        // Don't retry if not retryable or on last attempt
        if (!this.isRetryableError(error) || attempt === this.config.maxRetries) {
          break;
        }
        
        const delay = this.calculateRetryDelay(attempt);
        logger.warn(`Request failed (attempt ${attempt + 1}/${this.config.maxRetries + 1}), retrying in ${delay}ms`, error);
        await this.wait(delay);
      }
    }
    
    // Try fallback to cached response
    if (cacheKey && this.config.enableFallback) {
      const cached = this.getCachedResponse<ApiResponse<T>>(cacheKey);
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
  async get<T = any>(url: string, config?: any): Promise<ApiResponse<T>> {
    const cacheKey = this.getCacheKey('GET', url, config?.params);
    
    // Request deduplication: return existing pending request if any
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)!;
    }
    
    const requestPromise = this.executeWithRetry<T>(
      () => this.apiClient.get<T>(url, config),
      cacheKey
    );
    
    this.pendingRequests.set(cacheKey, requestPromise);
    
    try {
      const response = await requestPromise;
      return response;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  /**
   * POST request with resilience (no caching)
   */
  async post<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    return this.executeWithRetry<T>(() => this.apiClient.post<T>(url, data, config));
  }

  /**
   * PUT request with resilience (no caching)
   */
  async put<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    return this.executeWithRetry<T>(() => this.apiClient.put<T>(url, data, config));
  }

  /**
   * PATCH request with resilience (no caching)
   */
  async patch<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    return this.executeWithRetry<T>(() => this.apiClient.patch<T>(url, data, config));
  }

  /**
   * DELETE request with resilience (no caching)
   */
  async delete<T = any>(url: string, config?: any): Promise<ApiResponse<T>> {
    return this.executeWithRetry<T>(() => this.apiClient.delete<T>(url, config));
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
  clearCacheFor(method: string, url: string, params?: any): void {
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
